"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Calendar, MessageSquare, Eye } from "lucide-react"

export default function SolicitacoesKanban() {
  const colunas = [
    {
      id: "aberto",
      titulo: "Abertos",
      cor: "border-blue-500",
      tickets: [
        {
          id: "TK-001",
          titulo: "Erro na importação do relatório F360",
          cliente: "Empresa ABC Ltda",
          prioridade: "alta",
          responsavel: "João Silva",
          dataAbertura: "15/01/2025",
        },
        {
          id: "TK-004",
          titulo: "Problema no upload de documentos",
          cliente: "Loja DEF",
          prioridade: "media",
          responsavel: "Ana Costa",
          dataAbertura: "15/01/2025",
        },
      ],
    },
    {
      id: "andamento",
      titulo: "Em Andamento",
      cor: "border-orange-500",
      tickets: [
        {
          id: "TK-002",
          titulo: "Dúvida sobre fechamento de caixa",
          cliente: "Loja XYZ",
          prioridade: "media",
          responsavel: "Maria Santos",
          dataAbertura: "15/01/2025",
        },
      ],
    },
    {
      id: "aguardando",
      titulo: "Aguardando Cliente",
      cor: "border-yellow-500",
      tickets: [
        {
          id: "TK-005",
          titulo: "Validação de dados bancários",
          cliente: "Comércio GHI",
          prioridade: "baixa",
          responsavel: "Pedro Costa",
          dataAbertura: "14/01/2025",
        },
      ],
    },
    {
      id: "resolvido",
      titulo: "Resolvidos",
      cor: "border-green-500",
      tickets: [
        {
          id: "TK-003",
          titulo: "Solicitação de novo usuário",
          cliente: "Comércio 123",
          prioridade: "baixa",
          responsavel: "Pedro Costa",
          dataAbertura: "14/01/2025",
        },
      ],
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {colunas.map((coluna) => (
        <Card key={coluna.id} className={`border-0 shadow-md border-t-4 ${coluna.cor}`}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center justify-between">
              {coluna.titulo}
              <Badge variant="secondary">{coluna.tickets.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {coluna.tickets.map((ticket) => (
              <Card key={ticket.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-primary">{ticket.id}</span>
                      <Badge className={getPrioridadeColor(ticket.prioridade)} variant="secondary">
                        {ticket.prioridade}
                      </Badge>
                    </div>

                    <h4 className="font-medium text-sm leading-tight">{ticket.titulo}</h4>

                    <p className="text-xs text-gray-600">{ticket.cliente}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {ticket.responsavel}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {ticket.dataAbertura}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        Ver
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <MessageSquare className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
