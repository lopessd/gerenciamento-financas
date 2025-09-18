"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Paperclip, FileText, X } from "lucide-react"
import CommentCard from "./comment-card"

export interface ChatMessage {
  id: string
  author: string
  role: "cliente" | "operador" | "sistema"
  text: string
  timestamp: string
  isCurrentUser?: boolean
  attachments?: Array<{
    id: string
    name: string
    url: string
    size: number
    type: string
  }>
}

export interface ChatComponentProps {
  messages: ChatMessage[]
  onSendMessage: (message: string, attachments: File[]) => void
  currentUserRole: "cliente" | "operador"
  placeholder?: string
  allowAttachments?: boolean
  maxFileSize?: number // em bytes
  acceptedFileTypes?: string[]
  disabled?: boolean
  className?: string
  height?: string
}

export default function ChatComponent({
  messages,
  onSendMessage,
  currentUserRole,
  placeholder = "Digite sua mensagem...",
  allowAttachments = true,
  maxFileSize = 10 * 1024 * 1024, // 10MB por padrão
  acceptedFileTypes = ["image/*", "application/pdf"],
  disabled = false,
  className = "",
  height = "h-full"
}: ChatComponentProps) {
  const [newMessage, setNewMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Auto-scroll quando mensagens mudarem
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = acceptedFileTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.replace('/*', '/'))
        }
        return file.type === type
      })
      return isValidType && file.size <= maxFileSize
    })

    setAttachments([...attachments, ...validFiles])

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index))
  }

  const handleSendMessage = () => {
    if (disabled) return

    if (newMessage.trim() || attachments.length > 0) {
      onSendMessage(newMessage, attachments)
      setNewMessage("")
      setAttachments([])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Calcular altura dinâmica do textarea baseado no conteúdo
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [textareaLines, setTextareaLines] = useState(1) // Número de linhas

  // Ajustar altura do textarea dinamicamente
  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current
      textarea.style.height = 'auto'
      
      const lineHeight = 20 // altura de uma linha
      const padding = 12 // padding total (6px top + 6px bottom)
      const minHeight = lineHeight + padding // altura mínima (1 linha + padding)
      const maxHeightNoScroll = (lineHeight * 2) + padding // máximo sem scroll (2 linhas + padding)
      const scrollHeight = textarea.scrollHeight
      
      if (scrollHeight <= maxHeightNoScroll) {
        // 1-2 linhas: sem scroll, altura dinâmica
        textarea.style.height = `${Math.max(scrollHeight, minHeight)}px`
        textarea.style.overflowY = 'hidden'
        setTextareaLines(Math.ceil((scrollHeight - padding) / lineHeight))
      } else {
        // 3+ linhas: com scroll, altura fixa
        textarea.style.height = `${maxHeightNoScroll}px`
        textarea.style.overflowY = 'auto'
        setTextareaLines(2)
      }
    }
  }, [newMessage])

  // (Removed runtime positioning) we'll use flex layout to keep icons aligned to textarea bottom

  // Calcular altura dinâmica da área de anexos
  const attachmentAreaHeight = attachments.length > 0 ? Math.ceil(attachments.length / 3) * 60 + 60 : 0
  
  // Calcular altura total da área de input (com anexos e textarea)
  const inputAreaHeight = 64 + attachmentAreaHeight + (textareaLines > 1 ? 20 : 0) // padding base + anexos + linhas extras do textarea

  return (
    <div className={`${height} flex flex-col ${className}`}>
      {/* Área de mensagens com scroll independente - altura dinâmica */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50"
        style={{
          height: `calc(100% - ${inputAreaHeight}px)`,
          minHeight: `calc(100% - ${inputAreaHeight}px)`
        }}
      >
        {messages.map((message) => (
          <CommentCard
            key={message.id}
            author={message.author}
            role={message.role}
            text={message.text}
            timestamp={message.timestamp}
            isCurrentUser={message.isCurrentUser}
            attachments={message.attachments}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Footer fixo - altura fixa na parte inferior */}
      <div className="flex-shrink-0 border-t bg-white shadow-lg">
        {/* Área de anexos selecionados - layout horizontal em grade */}
        {attachments.length > 0 && (
          <div className="px-4 pt-2 pb-1 border-b bg-gray-50">
            <div className="flex items-center gap-2 mb-2">
              <Paperclip className="h-3 w-3 text-gray-500" />
              <span className="text-xs font-normal text-gray-700">Arquivos anexados:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {attachments.map((file, index) => (
                <div key={index} title={file.name} className="flex items-center justify-between p-2 bg-white rounded border text-xs">
                  <div className="flex items-center gap-1 flex-1 min-w-0">
                    <FileText className="h-3 w-3 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 truncate">
                      {file.name}
                    </span>
                    <span className="text-gray-500 flex-shrink-0">
                      ({(file.size / 1024).toFixed(0)}KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-6 w-6 p-0 ml-1 flex-shrink-0"
                    disabled={disabled}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input principal */}
        <div className="px-4 py-2">
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                placeholder={placeholder}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="w-full px-3 py-1 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent leading-5"
                disabled={disabled}
                rows={1}
                style={{
                  minHeight: '32px',
                  lineHeight: '20px'
                }}
              />
            </div>

            {/* Actions row: attach + send buttons to the right of the textarea, aligned to center */}
            <div className="flex items-center gap-2">
              {allowAttachments && (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept={acceptedFileTypes.join(',')}
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => fileInputRef.current?.click()}
                    className="shrink-0"
                    disabled={disabled}
                    style={{ height: '32px', width: '32px' }}
                  >
                    <Paperclip className="h-4 w-4" />
                  </Button>
                </>
              )}

              <Button
                onClick={handleSendMessage}
                disabled={disabled || (!newMessage.trim() && attachments.length === 0)}
                className="bg-green-600 hover:bg-green-700 shrink-0"
                size="icon"
                style={{ height: '32px', width: '32px' }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
