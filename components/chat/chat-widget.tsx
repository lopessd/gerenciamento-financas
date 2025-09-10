"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@/contexts/chat-context"
import { useAuth } from "@/contexts/auth-context"
import { Send, X, Paperclip, User, Bot } from "lucide-react"

export default function ChatWidget() {
  const [newMessage, setNewMessage] = useState("")
  const { messages, isOpen, sendMessage, toggleChat } = useChat()
  const { user } = useAuth()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
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
    const variants = {
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

  if (!isOpen) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Chat de Suporte</CardTitle>
              <Badge className="bg-green-100 text-green-700">Online</Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleChat}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Messages */}
          <ScrollArea className="h-80 px-4">
            <div className="space-y-4 py-2">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === user?.id
                return (
                  <div key={message.id} className={`flex gap-3 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        {getRoleIcon(message.senderRole)}
                      </div>
                    </div>

                    <div className={`flex-1 max-w-[80%] ${isOwnMessage ? "text-right" : "text-left"}`}>
                      <div className="flex items-center gap-2 mb-1">
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
                        className={`rounded-lg px-3 py-2 text-sm ${
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
          <div className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Button type="button" variant="ghost" size="icon" className="flex-shrink-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
