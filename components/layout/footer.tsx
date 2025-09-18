"use client"

import { MessageCircle, Home, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useChat } from "@/contexts/chat-context"
import { Badge } from "@/components/ui/badge"

export default function Footer() {
  const { unreadCount, toggleChat } = useChat()

  // Footer móvel ocultado por requisição: mantido no arquivo como comentário para referência.
  /*
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div className="flex items-center justify-around py-2">
        <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2 relative" onClick={toggleChat}>
          <MessageCircle className="h-5 w-5" />
          <span className="text-xs">Chat</span>
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs bg-primary">{unreadCount}</Badge>
          )}
        </Button>

        <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
          <Home className="h-5 w-5 text-primary" />
          <span className="text-xs text-primary">Início</span>
        </Button>

        <Button variant="ghost" size="sm" className="flex flex-col gap-1 h-auto py-2">
          <Settings className="h-5 w-5" />
          <span className="text-xs">Config</span>
        </Button>
      </div>
    </footer>
  )
  */

  // Retorna null para ocultar o footer mas manter o código comentado no arquivo.
  return null
}
