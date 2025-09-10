"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { useAuth } from "./auth-context"

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

interface ChatContextType {
  messages: Message[]
  unreadCount: number
  isOpen: boolean
  sendMessage: (content: string, type?: "text" | "file", fileName?: string) => void
  markAsRead: () => void
  toggleChat: () => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Mock messages for demonstration
const mockMessages: Message[] = [
  {
    id: "1",
    senderId: "operador1",
    senderName: "João Silva",
    senderRole: "operador",
    content: "Olá! Como posso ajudá-lo hoje?",
    timestamp: new Date(2025, 0, 20, 9, 0),
    type: "text",
  },
  {
    id: "2",
    senderId: "cliente1",
    senderName: "Cliente Teste",
    senderRole: "cliente",
    content: "Preciso de ajuda com o fechamento de caixa de ontem.",
    timestamp: new Date(2025, 0, 20, 9, 5),
    type: "text",
  },
  {
    id: "3",
    senderId: "operador1",
    senderName: "João Silva",
    senderRole: "operador",
    content: "Claro! Vou verificar o status do seu fechamento. Pode me informar qual foi o valor total de vendas?",
    timestamp: new Date(2025, 0, 20, 9, 7),
    type: "text",
  },
  {
    id: "4",
    senderId: "cliente1",
    senderName: "Cliente Teste",
    senderRole: "cliente",
    content: "O valor foi R$ 12.450,00. Anexei o comprovante de sangria também.",
    timestamp: new Date(2025, 0, 20, 9, 10),
    type: "text",
  },
]

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>(mockMessages)
  const [unreadCount, setUnreadCount] = useState(2)
  const [isOpen, setIsOpen] = useState(false)
  const { user } = useAuth()

  const sendMessage = (content: string, type: "text" | "file" = "text", fileName?: string) => {
    if (!user || !content.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      content: content.trim(),
      timestamp: new Date(),
      type,
      fileName,
    }

    setMessages((prev) => [...prev, newMessage])

    // Simulate response from operator (for demo purposes)
    if (user.role === "cliente") {
      setTimeout(() => {
        const responseMessage: Message = {
          id: (Date.now() + 1).toString(),
          senderId: "operador1",
          senderName: "João Silva",
          senderRole: "operador",
          content: "Recebido! Vou analisar e retorno em breve.",
          timestamp: new Date(),
          type: "text",
        }
        setMessages((prev) => [...prev, responseMessage])
        if (!isOpen) {
          setUnreadCount((prev) => prev + 1)
        }
      }, 2000)
    }
  }

  const markAsRead = () => {
    setUnreadCount(0)
  }

  const toggleChat = () => {
    setIsOpen((prev) => {
      const newState = !prev
      if (newState) {
        markAsRead()
      }
      return newState
    })
  }

  return (
    <ChatContext.Provider
      value={{
        messages,
        unreadCount,
        isOpen,
        sendMessage,
        markAsRead,
        toggleChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
