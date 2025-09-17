"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react"

const recentMovements = [
  {
    id: 1,
    tipo: "entrada",
    valor: "R$ 2.500,00",
    descricao: "Depósito bancário",
    data: "2025-01-20",
    status: "concluido",
  },
  {
    id: 2,
    tipo: "saida",
    valor: "R$ 800,00",
    descricao: "Pagamento fornecedor",
    data: "2025-01-20",
    status: "pendente",
  },
  {
    id: 3,
    tipo: "transferencia",
    valor: "R$ 1.200,00",
    descricao: "Transferência entre contas",
    data: "2025-01-19",
    status: "concluido",
  },
  {
    id: 4,
    tipo: "entrada",
    valor: "R$ 450,00",
    descricao: "Recebimento cliente",
    data: "2025-01-19",
    status: "revisao",
  },
]

const getMovementIcon = (tipo: string) => {
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

const getStatusBadge = (status: string) => {
  const variants = {
    concluido: { variant: "default" as const, className: "bg-green-100 text-green-700", label: "Concluído" },
    pendente: { variant: "secondary" as const, className: "bg-orange-100 text-orange-700", label: "Pendente" },
    revisao: { variant: "outline" as const, className: "bg-yellow-100 text-yellow-700", label: "Em Revisão" },
  }

  const config = variants[status as keyof typeof variants] || variants.pendente
  return (
    <Badge variant="status" className={config.className}>
      {config.label}
    </Badge>
  )
}

export default function CofreDashboard() {
  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Entradas</p>
                <p className="text-2xl font-bold">R$ 45.230</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+15%</span>
                </div>
              </div>
              <ArrowUpCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Saídas</p>
                <p className="text-2xl font-bold">R$ 38.670</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-500">+8%</span>
                </div>
              </div>
              <ArrowDownCircle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conferência</p>
              <p className="text-2xl font-bold">92%</p>
              <Progress value={92} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Movimentações Hoje</p>
              <p className="text-2xl font-bold">18</p>
              <Progress value={75} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Recent Movements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Movimentações por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowUpCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Entradas</span>
                </div>
                <span className="font-medium">R$ 45.230 (58%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ArrowDownCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Saídas</span>
                </div>
                <span className="font-medium">R$ 38.670 (42%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Transferências</span>
                </div>
                <span className="font-medium">12 operações</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Movimentações Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMovements.map((movement) => (
                <div key={movement.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getMovementIcon(movement.tipo)}
                    <div>
                      <p className="text-sm font-medium">{movement.descricao}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(movement.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{movement.valor}</p>
                    {getStatusBadge(movement.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Saldo Anterior:</span>
                <span className="font-medium">R$ 12.340</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Entradas:</span>
                <span className="font-medium text-green-600">+R$ 6.560</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Saídas:</span>
                <span className="font-medium text-red-600">-R$ 4.450</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold">
                <span>Saldo Atual:</span>
                <span>R$ 14.450</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Alertas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 bg-red-50 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span className="text-sm">3 movimentações atrasadas</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm">5 pendentes de revisão</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                <span className="text-sm">Quebra detectada: R$ 560</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Metas do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Conferências</span>
                  <span>92/100</span>
                </div>
                <Progress value={92} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tempo Médio</span>
                  <span>1.2h/2h</span>
                </div>
                <Progress value={60} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Precisão</span>
                  <span>96/95%</span>
                </div>
                <Progress value={100} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
