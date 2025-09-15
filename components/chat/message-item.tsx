import type React from "react"
import { memo } from "react"
import { Badge } from "@/components/ui/badge"
import { User, Bot } from "lucide-react"

interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "cliente" | "operador" | "admin"
  content: string
  timestamp: Date
  type: "text" | "file"
  fileName?: string
}

interface MessageItemProps {
  message: Message
  isOwnMessage: boolean
  formatTime: (date: Date) => string
}

const MessageItem = memo(({ message, isOwnMessage, formatTime }: MessageItemProps) => {
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

  return (
    <div className={`flex gap-4 ${isOwnMessage ? "flex-row-reverse" : "flex-row"}`}>
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
})

MessageItem.displayName = "MessageItem"

export default MessageItem
