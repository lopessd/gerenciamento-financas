"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, MessageSquare, Eye, User, Clock } from "lucide-react"

export default function SolicitacoesLista() {
  const [searchTerm, setSearchTerm] = useState("")

  const tickets = [
    {
      id: "TK-001",
      titulo: "Erro na importação do relatório F360",
      cliente: "Empresa ABC Ltda",
      fila: "Técnico",
      tema: "Sistema",
      prioridade: "alta",
      status: "aberto",
      responsavel: "João Silva",
      dataAbertura: "15/01/2025 14:30",
      ultimaAtualizacao: "15/01/2025 16:45",
    },
    {
      id: "TK-002",
      titulo: "Dúvida sobre fechamento de caixa",
      cliente: "Loja XYZ",
      fila: "Suporte",
      tema: "Processo",
      prioridade: "media",
      status: "andamento",
      responsavel: "Maria Santos",
      dataAbertura: "15/01/2025 09:15",
      ultimaAtualizacao: "15/01/2025 15:20",
    },
    {
      id: "TK-003",
      titulo: "Solicitação de novo usuário",
      cliente: "Comércio 123",
      fila: "Administrativo",
      tema: "Acesso",
      prioridade: "baixa",
      status: "resolvido",
      responsavel: "Pedro Costa",
      dataAbertura: "14/01/2025 11:00",
      ultimaAtualizacao: "15/01/2025 10:30",
    },
  ]

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "alta":
        return "bg-red-100 text-red-800"
      case "media":
        return "bg-yellow-100 text-yellow-800"
      case "baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "aberto":
        return "bg-blue-100 text-blue-800"
      case "andamento":
        return "bg-orange-100 text-orange-800"
      case "resolvido":
        return "bg-green-100 text-green-800"
      case "fechado":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Filtros
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="">Todas as filas</option>
                <option value="tecnico">Técnico</option>
                <option value="suporte">Suporte</option>
                <option value="administrativo">Administrativo</option>
              </select>
              <select className="px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm">
                <option value="">Todos os status</option>
                <option value="aberto">Aberto</option>
                <option value="andamento">Em Andamento</option>
                <option value="resolvido">Resolvido</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id} className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                {/* Header with ID, priority and status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-primary">{ticket.id}</span>
                    <Badge className={getPrioridadeColor(ticket.prioridade)}>{ticket.prioridade}</Badge>
                    <Badge className={getStatusColor(ticket.status)}>{ticket.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {ticket.ultimaAtualizacao}
                  </div>
                </div>

                {/* Title and client */}
                <div>
                  <h3 className="font-medium text-foreground">{ticket.titulo}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{ticket.cliente}</p>
                </div>

                {/* Details */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Fila:</span>
                    <span className="font-medium">{ticket.fila}</span>
                  </div>
                  <div className="hidden sm:block text-muted-foreground">•</div>
                  <div className="flex items-center gap-1">
                    <span className="text-muted-foreground">Tema:</span>
                    <span className="font-medium">{ticket.tema}</span>
                  </div>
                </div>

                {/* Responsible and actions */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Responsável:</span>
                    <span className="font-medium">{ticket.responsavel}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                      <Eye className="h-4 w-4" />
                      <span className="hidden sm:inline">Ver</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Chat</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
