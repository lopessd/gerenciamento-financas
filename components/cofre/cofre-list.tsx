"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Eye,
  MessageSquare,
  RotateCcw,
  CheckCircle,
  Search,
  ArrowUpCircle,
  ArrowDownCircle,
  RefreshCw,
  Calendar,
} from "lucide-react"

const mockMovimentacoes = [
  {
    id: 1,
    tipo: "entrada",
    descricao: "Depósito bancário",
    data: "2025-01-20",
    valor: "R$ 2.500,00",
    status: "concluido",
    responsavel: "João Silva",
    comentarios: 1,
  },
  {
    id: 2,
    tipo: "saida",
    descricao: "Pagamento fornecedor ABC",
    data: "2025-01-20",
    valor: "R$ 800,00",
    status: "pendente",
    responsavel: "Maria Santos",
    comentarios: 2,
  },
  {
    id: 3,
    tipo: "transferencia",
    descricao: "Transferência entre contas",
    data: "2025-01-19",
    valor: "R$ 1.200,00",
    status: "revisao",
    responsavel: "Pedro Costa",
    comentarios: 0,
  },
  {
    id: 4,
    tipo: "entrada",
    descricao: "Recebimento cliente XYZ",
    data: "2025-01-19",
    valor: "R$ 450,00",
    status: "concluido",
    responsavel: "Ana Lima",
    comentarios: 1,
  },
  {
    id: 5,
    tipo: "saida",
    descricao: "Pagamento de impostos",
    data: "2025-01-18",
    valor: "R$ 1.350,00",
    status: "atrasado",
    responsavel: "Carlos Oliveira",
    comentarios: 3,
  },
]

const getStatusBadge = (status: string) => {
  const variants = {
    concluido: { variant: "default" as const, className: "bg-green-100 text-green-700", label: "Concluído" },
    pendente: { variant: "secondary" as const, className: "bg-orange-100 text-orange-700", label: "Pendente" },
    revisao: { variant: "outline" as const, className: "bg-yellow-100 text-yellow-700", label: "Em Revisão" },
    atrasado: { variant: "destructive" as const, className: "", label: "Atrasado" },
  }

  const config = variants[status as keyof typeof variants] || variants.pendente
  return (
    <Badge variant="status" className={config.className}>
      {config.label}
    </Badge>
  )
}

const getTipoIcon = (tipo: string) => {
  switch (tipo) {
    case "entrada":
      return <ArrowUpCircle className="h-4 w-4 text-green-500" />
    case "saida":
      return <ArrowDownCircle className="h-4 w-4 text-red-500" />
    case "transferencia":
      return <RefreshCw className="h-4 w-4 text-blue-500" />
    default:
      return null
  }
}

export default function CofreList() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lista de Movimentações</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar movimentação..." className="pl-10 w-64" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockMovimentacoes.map((movimentacao) => (
            <Card key={movimentacao.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      {getTipoIcon(movimentacao.tipo)}
                      <span className="font-medium">{movimentacao.descricao}</span>
                      {getStatusBadge(movimentacao.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(movimentacao.data).toLocaleDateString("pt-BR")}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{movimentacao.valor}</span>
                      </div>
                      <div>Resp: {movimentacao.responsavel}</div>
                      <div className="flex items-center gap-1">
                        {movimentacao.comentarios > 0 && (
                          <>
                            <MessageSquare className="h-3 w-3" />
                            <span>{movimentacao.comentarios}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {movimentacao.status === "pendente" && (
                      <>
                        <Button variant="ghost" size="icon">
                          <RotateCcw className="h-4 w-4 text-orange-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
