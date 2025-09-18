"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, UserCheck, Download, FileText, Image, File } from "lucide-react"

interface CommentCardProps {
  author: string
  role: "cliente" | "operador" | "sistema"
  text: string
  timestamp: string
  avatar?: string
  isCurrentUser?: boolean
  attachments?: Array<{
    id: string
    name: string
    url: string
    size: number
    type: string
  }>
}

export default function CommentCard({
  author,
  role,
  text,
  timestamp,
  avatar,
  isCurrentUser = false,
  attachments = []
}: CommentCardProps) {
  const isOperator = role === "operador"
  const isSystem = role === "sistema"

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-4 w-4" />
    if (type === 'application/pdf') return <FileText className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const getBadgeLabel = () => {
    if (isOperator) return 'Operador'
    if (isSystem) return 'Sistema'
    return 'Cliente'
  }

  const getAvatarColor = () => {
    if (isOperator) return 'bg-green-100 text-green-700'
    if (isSystem) return 'bg-gray-100 text-gray-700'
    return 'bg-blue-100 text-blue-700'
  }

  const getBadgeColor = () => {
    if (isOperator) return 'border-green-300 text-green-700 bg-green-50'
    if (isSystem) return 'border-gray-300 text-gray-700 bg-gray-50'
    return 'border-blue-300 text-blue-700 bg-blue-50'
  }

  const getMessageColor = () => {
    if (isCurrentUser) return 'bg-green-600 text-white rounded-br-sm'
    if (isOperator) return 'bg-white border border-green-200 text-gray-900 rounded-bl-sm'
    if (isSystem) return 'bg-gray-200 border border-gray-300 text-gray-800 rounded-bl-sm'
    return 'bg-gray-100 text-gray-900 rounded-bl-sm'
  }

  return (
    <div className={`flex gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
      {!isCurrentUser && (
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          {avatar ? (
            <img src={avatar} alt={author} className="rounded-full" />
          ) : (
            <AvatarFallback className={getAvatarColor()}>
              {isOperator ? (
                <UserCheck className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
            </AvatarFallback>
          )}
        </Avatar>
      )}

      <div className={`max-w-[75%] ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
        {!isCurrentUser && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-gray-700">{author}</span>
            <Badge
              variant="outline"
              className={`text-xs h-4 px-1.5 ${getBadgeColor()}`}
            >
              {getBadgeLabel()}
            </Badge>
          </div>
        )}

        <div
          className={`rounded-lg px-3 py-2 ${getMessageColor()}`}
        >
          {text && (
            <p className="text-sm leading-relaxed break-words">
              {text}
            </p>
          )}

          {/* Anexos */}
          {attachments.length > 0 && (
            <div className={`space-y-2 ${text ? 'mt-2' : ''}`}>
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  title={attachment.name}
                  className={`flex items-center gap-2 p-2 rounded border ${
                    isCurrentUser
                      ? 'bg-green-700 border-green-500'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className={isCurrentUser ? 'text-green-100' : 'text-gray-500'}>
                    {getFileIcon(attachment.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${
                      isCurrentUser ? 'text-white' : 'text-gray-700'
                    }`}>
                      {attachment.name}
                    </p>
                    <p className={`text-xs ${
                      isCurrentUser ? 'text-green-100' : 'text-gray-500'
                    }`}>
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className={`h-6 w-6 p-0 ${
                      isCurrentUser
                        ? 'text-white hover:bg-green-700'
                        : 'text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        <time className={`text-xs text-gray-500 mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
          {timestamp}
        </time>
      </div>

      {isCurrentUser && (
        <Avatar className="h-7 w-7 shrink-0 mt-0.5">
          {avatar ? (
            <img src={avatar} alt={author} className="rounded-full" />
          ) : (
            <AvatarFallback className="bg-green-100 text-green-700">
              {isOperator ? (
                <UserCheck className="h-3 w-3" />
              ) : (
                <User className="h-3 w-3" />
              )}
            </AvatarFallback>
          )}
        </Avatar>
      )}
    </div>
  )
}
