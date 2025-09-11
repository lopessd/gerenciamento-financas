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
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CustomDropdown, CustomDropdownItem, CustomDropdownSeparator } from "@/components/ui/custom-dropdown"
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

  // Corrige o posicionamento dos dropdowns após montagem
  useEffect(() => {
    const fixDropdownPosition = () => {
      const dropdowns = document.querySelectorAll('[data-radix-dropdown-menu-content]')
      dropdowns.forEach((dropdown, index) => {
        const element = dropdown as HTMLElement
        element.style.position = 'fixed'
        element.style.top = '60px'
        element.style.right = index === 0 ? '80px' : '16px' // Primeiro dropdown (notificações) mais à esquerda
        element.style.left = 'auto'
        element.style.transform = 'none'
        element.style.zIndex = '9999'
      })
    }

    // Observer para detectar quando dropdowns são criados
    const observer = new MutationObserver(fixDropdownPosition)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect()
  }, [])

  return (
    <header className="sticky top-0 bg-gradient-to-r from-teal-800 to-teal-900 border-b border-teal-700 shadow-sm z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src="/fullcash-logo.png" 
            alt="Full Ca$h" 
            className="h-8 w-auto"
          />
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <CustomDropdown
            trigger={
              <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500 text-white flex items-center justify-center">
                    {unreadNotifications}
                  </Badge>
                )}
              </Button>
            }
            width={320}
            className="w-80"
          >
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-gray-900">Notificações</p>
              <p className="text-xs text-gray-600">{unreadNotifications} não lidas</p>
            </div>
            <CustomDropdownSeparator />
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((notification) => (
                <CustomDropdownItem key={notification.id} className="flex items-start gap-3 p-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium ${!notification.read ? "text-gray-900" : "text-gray-600"}`}
                      >
                        {notification.title}
                      </p>
                      {!notification.read && <div className="h-2 w-2 bg-green-500 rounded-full" />}
                    </div>
                    <p className="text-xs text-gray-600">{notification.message}</p>
                    <p className="text-xs text-gray-500">{notification.time}</p>
                  </div>
                </CustomDropdownItem>
              ))}
            </div>
            <CustomDropdownSeparator />
            <CustomDropdownItem className="justify-center text-sm text-green-500">
              Ver todas as notificações
            </CustomDropdownItem>
          </CustomDropdown>

          {/* Chat */}
          <Button variant="ghost" size="icon" className="relative text-white hover:bg-white/20 hover:text-white" onClick={toggleChat}>
            <MessageCircle className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-green-500 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          <CustomDropdown
            trigger={
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                <User className="h-5 w-5" />
              </Button>
            }
            width={224}
            className="w-56"
          >
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-600">{user?.email}</p>
              {user?.selectedCompany && user.role === "cliente" && (
                <p className="text-xs text-gray-600 mt-1">{user.selectedCompany.name}</p>
              )}
            </div>
            <CustomDropdownSeparator />
            <CustomDropdownItem className="text-gray-900">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </CustomDropdownItem>
            {user && (user.role === "operador" || user.role === "admin") && (
              <>
                <CustomDropdownItem onClick={handleCompanySwitch} className="text-gray-900">
                  <Building2 className="mr-2 h-4 w-4" />
                  Trocar Empresa
                </CustomDropdownItem>
                <CustomDropdownSeparator />
              </>
            )}
            <CustomDropdownItem onClick={handleLogout} className="text-gray-900">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </CustomDropdownItem>
          </CustomDropdown>
        </div>
      </div>
    </header>
  )
}
