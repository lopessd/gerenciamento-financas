"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Send, Paperclip, User, Bot } from "lucide-react"
import { useState, useRef } from "react"

export default function ChatPage() {
  const { user, isLoading } = useAuth()
  const { messages, sendMessage } = useChat()
  const [newMessage, setNewMessage] = useState("")
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
  }, [user, isLoading, router])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim()) {
      sendMessage(newMessage)
      setNewMessage("")
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "operador":
      case "admin":
        return <Bot className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleBadge = (role: string) => {
    const variants: Record<string, { className: string, label: string }> = {
      cliente: { className: "bg-blue-100 text-blue-700", label: "Cliente" },
      operador: { className: "bg-green-100 text-green-700", label: "Suporte" },
      admin: { className: "bg-purple-100 text-purple-700", label: "Admin" },
    }

    const config = variants[role] || variants.cliente
    return (
      <Badge variant="outline" className={`${config.className} text-xs`}>
        {config.label}
      </Badge>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Chat de Suporte</h1>
            <p className="text-muted-foreground">Comunicação em tempo real com a equipe</p>
          </div>
        </div>

        {/* Chat Card */}
        <Card className="border-0 shadow-md h-[600px] flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Conversa</CardTitle>
              <Badge className="bg-green-100 text-green-700">Online</Badge>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            {/* Messages */}
            <ScrollArea className="flex-1 px-6">
              <div className="space-y-4 py-4">
                {messages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id
                  return (
                    <div key={message.id} className={`flex gap-4 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          {getRoleIcon(message.senderRole)}
                        </div>
                      </div>

                      <div className={`flex-1 max-w-[70%] ${isOwnMessage ? "text-right" : "text-left"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {!isOwnMessage && (
                            <>
                              <span className="text-sm font-medium">{message.senderName}</span>
                              {getRoleBadge(message.senderRole)}
                            </>
                          )}
                          {isOwnMessage && (
                            <>
                              {getRoleBadge(message.senderRole)}
                              <span className="text-sm font-medium">{message.senderName}</span>
                            </>
                          )}
                        </div>

                        <div
                          className={`rounded-lg px-4 py-3 text-sm ${
                            isOwnMessage ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {message.content}
                          {message.fileName && <div className="mt-2 text-xs opacity-75">📎 {message.fileName}</div>}
                        </div>

                        <div className="text-xs text-muted-foreground mt-1">{formatTime(message.timestamp)}</div>
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-6 border-t">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 h-12"
                />
                <Button type="submit" size="icon" className="h-12 w-12" disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
