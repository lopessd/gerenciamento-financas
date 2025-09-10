"use client"

import {
  Bell,
  MessageCircle,
  DollarSign,
  User,
  LogOut,
  Settings,
  Building2,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { useChat } from "@/contexts/chat-context"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function Header() {
  const { user, logout } = useAuth()
  const { unreadCount, toggleChat } = useChat()
  const router = useRouter()
  const [notifications] = useState([
    {
      id: 1,
      title: "Fechamento de Caixa Pendente",
      message: "Loja Centro - 15/01/2025 aguardando validação",
      time: "5 min atrás",
      type: "warning",
      read: false,
    },
    {
      id: 2,
      title: "Contas a Pagar Aprovadas",
      message: "3 documentos foram aprovados para pagamento",
      time: "1 hora atrás",
      type: "success",
      read: false,
    },
    {
      id: 3,
      title: "Nova Solicitação",
      message: "Ticket #1234 - Dúvida sobre conciliação",
      time: "2 horas atrás",
      type: "info",
      read: true,
    },
  ])

  const unreadNotifications = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleCompanySwitch = () => {
    router.push("/select-company")
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <DollarSign className="h-8 w-8 text-green-500" />
          <span className="text-2xl font-bold text-green-500">Full Ca$h</span>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="px-3 py-2">
                <p className="text-sm font-medium">Notificações</p>
                <p className="text-xs text-muted-foreground">{unreadNotifications} não lidas</p>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-64 overflow-y-auto">
                {notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex items-start gap-3 p-3 cursor-pointer">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && <div className="h-2 w-2 bg-green-500 rounded-full" />}
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-sm text-green-500">
                Ver todas as notificações
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Chat */}
          <Button variant="ghost" size="icon" className="relative" onClick={toggleChat}>
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-green-500 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {user?.selectedCompany && user.role === "cliente" && (
                  <p className="text-xs text-muted-foreground mt-1">{user.selectedCompany.name}</p>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              {user && (user.role === "operador" || user.role === "admin") && (
                <>
                  <DropdownMenuItem onClick={handleCompanySwitch}>
                    <Building2 className="mr-2 h-4 w-4" />
                    Trocar Empresa
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
