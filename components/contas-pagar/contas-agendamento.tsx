"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, MessageSquare, Calendar, Clock, Search, AlertTriangle } from "lucide-react"

const mockAgendamentos = [
  {
    id: 1,
    fornecedor: "Fornecedor ABC Ltda",
    valor: "R$ 2.450,00",
    vencimento: "2025-01-25",
    dataAgendamento: "2025-01-24",
    status: "agendado",
    prioridade: "normal",
    formaPagamento: "PIX",
    comentarios: 1,
  },
  {
    id: 2,
    fornecedor: "Empresa XYZ S.A.",
    valor: "R$ 1.280,00",
    vencimento: "2025-01-22",
    dataAgendamento: "2025-01-21",
    status: "vencido",
    prioridade: "alta",
    formaPagamento: "TED",
    comentarios: 3,
  },
  {
    id: 3,
    fornecedor: "Serviços DEF ME",
    valor: "R$ 850,00",
    vencimento: "2025-01-28",
    dataAgendamento: "2025-01-27",
    status: "pendente_aprovacao",
    prioridade: "normal",
    formaPagamento: "Boleto",
    comentarios: 0,
  },
  {
    id: 4,
    fornecedor: "Produtos GHI Ltda",
    valor: "R$ 3.200,00",
    vencimento: "2025-01-30",
    dataAgendamento: "2025-01-29",
    status: "aprovado",
    prioridade: "baixa",
    formaPagamento: "PIX",
    comentarios: 2,
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    agendado: {
      variant: "default" as const,
      className: "bg-blue-100 text-blue-700",
      label: "Agendado",
      icon: <Calendar className="h-3 w-3" />,
    },
    pendente_aprovacao: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-700",
      label: "Pendente Aprovação",
      icon: <Clock className="h-3 w-3" />,
    },
    aprovado: {
      variant: "default" as const,
      className: "bg-green-100 text-green-700",
      label: "Aprovado",
      icon: <Calendar className="h-3 w-3" />,
    },
    vencido: {
      variant: "destructive" as const,
      className: "",
      label: "Vencido",
      icon: <AlertTriangle className="h-3 w-3" />,
    },
  }

  const config = variants[status as keyof typeof variants] || variants.agendado
  return (
    <Badge variant="status" className={`${config.className} gap-1`}>
      {config.icon}
      {config.label}
    </Badge>
  )
}

const getPrioridadeBadge = (prioridade: string) => {
  const variants = {
    alta: { className: "bg-red-100 text-red-700", label: "Alta" },
    normal: { className: "bg-gray-100 text-gray-700", label: "Normal" },
    baixa: { className: "bg-green-100 text-green-700", label: "Baixa" },
  }

  const config = variants[prioridade as keyof typeof variants] || variants.normal
  return (
    <Badge variant="outline" className={config.className}>
      {config.label}
    </Badge>
  )
}

export default function ContasAgendamento() {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pagamentos Agendados</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar fornecedor..." className="pl-10 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Agendamentos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockAgendamentos.map((agendamento) => (
          <Card key={agendamento.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    {getStatusBadge(agendamento.status)}
                    {getPrioridadeBadge(agendamento.prioridade)}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {agendamento.formaPagamento}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Fornecedor</p>
                    <p className="font-medium text-foreground">{agendamento.fornecedor}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-bold text-lg text-primary">{agendamento.valor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vencimento</p>
                      <p className="font-medium">{new Date(agendamento.vencimento).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Data Agendamento</p>
                    <p className="font-medium">{new Date(agendamento.dataAgendamento).toLocaleDateString("pt-BR")}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {agendamento.comentarios > 0 && (
                      <>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{agendamento.comentarios}</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {agendamento.status === "pendente_aprovacao" && (
                      <Button size="sm" className="text-xs">
                        Aprovar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Próximos Vencimentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Hoje:</span>
                <span className="font-medium">R$ 4.230</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Amanhã:</span>
                <span className="font-medium">R$ 2.450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Esta semana:</span>
                <span className="font-medium">R$ 12.680</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Alertas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-red-600">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>2 pagamentos vencidos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span>5 pendentes aprovação</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-yellow-600">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span>3 vencem hoje</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>PIX:</span>
                <span className="font-medium">R$ 8.450</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>TED:</span>
                <span className="font-medium">R$ 5.230</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Boleto:</span>
                <span className="font-medium">R$ 2.100</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
