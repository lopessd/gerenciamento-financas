"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Clock, AlertTriangle, Eye, FileText, CheckCircle } from "lucide-react"
import FechamentoCard from "./fechamento-card"

interface FechamentoKanbanProps {
  onViewFechamento?: (fechamento: any) => void
}

// Mock data para setembro de 2025 (dias 1-17, excluindo finais de semana)
const mockFechamentos = [
  // Setembro - Semana 1
  { id: 1, empresa: "Supermercado ABC", data: "2025-09-01", valor: "R$ 15.450,00", status: "finalizado_concluido", responsavel: "João Silva", comentarios: 2, tipoFinalizacao: "concluido_sem_divergencia" },
  { id: 2, empresa: "Farmácia XYZ", data: "2025-09-02", valor: "R$ 4.280,00", status: "finalizado_concluido", responsavel: "Maria Santos", comentarios: 1, tipoFinalizacao: "parcialmente_concluido_divergencias" },
  { id: 3, empresa: "Loja de Roupas DEF", data: "2025-09-03", valor: "R$ 8.750,00", status: "em_andamento_pendencia", responsavel: "Pedro Costa", comentarios: 3 },
  { id: 4, empresa: "Padaria GHI", data: "2025-09-04", valor: "R$ 2.890,00", status: "finalizado_concluido", responsavel: "Ana Lima", comentarios: 0, tipoFinalizacao: "concluido_sem_movimento" },
  { id: 5, empresa: "Mercado JKL", data: "2025-09-05", valor: "R$ 6.200,00", status: "em_andamento_analise", responsavel: "Carlos Souza", comentarios: 1 },

  // Setembro - Semana 2 (dias 8-12, 6 e 7 são sábado/domingo)
  { id: 6, empresa: "Auto Peças MNO", data: "2025-09-08", valor: "R$ 5.800,00", status: "finalizado_concluido", responsavel: "Fernanda Lima", comentarios: 0, tipoFinalizacao: "quebra_caixa" },
  { id: 7, empresa: "Livraria PQR", data: "2025-09-09", valor: "R$ 3.150,00", status: "finalizado_concluido", responsavel: "Roberto Santos", comentarios: 2, tipoFinalizacao: "concluido_sem_divergencia" },
  { id: 8, empresa: "Hamburgueria STU", data: "2025-09-10", valor: "R$ 4.800,00", status: "em_andamento_analise", responsavel: "Patricia Oliveira", comentarios: 1 },
  { id: 9, empresa: "Floricultura VWX", data: "2025-09-11", valor: "R$ 1.950,00", status: "finalizado_concluido", responsavel: "Lucas Ferreira", comentarios: 0, tipoFinalizacao: "parcialmente_concluido_conferencia" },
  { id: 10, empresa: "Papelaria YZA", data: "2025-09-12", valor: "R$ 2.400,00", status: "em_andamento_pendencia", responsavel: "Camila Torres", comentarios: 2 },

  // Setembro - Semana 3 (dias 15-17, 13 e 14 são sábado/domingo)
  { id: 11, empresa: "Salão de Beleza BCD", data: "2025-09-15", valor: "R$ 3.600,00", status: "finalizado_concluido", responsavel: "Diego Alves", comentarios: 0, tipoFinalizacao: "concluido_sem_divergencia" },
  { id: 12, empresa: "Oficina EFG", data: "2025-09-16", valor: "R$ 7.300,00", status: "em_andamento_analise", responsavel: "Beatriz Costa", comentarios: 1 },
  { id: 13, empresa: "Clínica HIJ", data: "2025-09-17", valor: "R$ 9.200,00", status: "sem_envio_aguardando", responsavel: "Eduardo Melo", comentarios: 0 },

  // Dados atrasados (dias anteriores que não foram enviados)
  { id: 14, empresa: "Pet Shop KLM", data: "2025-09-01", valor: "Não informado", status: "sem_envio_atrasado", responsavel: "-", comentarios: 0 },
  { id: 15, empresa: "Relojoaria NOP", data: "2025-09-03", valor: "Não informado", status: "sem_envio_atrasado", responsavel: "-", comentarios: 0 },
]

const dateRangeOptions = [
  { value: "all", label: "Todas as Datas" },
  { value: "today", label: "Hoje" },
  { value: "week", label: "Últimos 7 dias" },
  { value: "month", label: "Últimos 30 dias" },
]

// Configuração das colunas do kanban
const kanbanColumns = [
  {
    id: "sem_envio_aguardando",
    title: "Aguardando",
    icon: Clock,
    color: "bg-blue-100 border-blue-200",
    headerColor: "text-blue-700 bg-blue-50",
    badgeColor: "bg-blue-500"
  },
  {
    id: "sem_envio_atrasado",
    title: "Atrasado",
    icon: AlertTriangle,
    color: "bg-red-100 border-red-200",
    headerColor: "text-red-700 bg-red-50",
    badgeColor: "bg-red-500"
  },
  {
    id: "em_andamento_analise",
    title: "Em Análise",
    icon: Eye,
    color: "bg-yellow-100 border-yellow-200",
    headerColor: "text-yellow-700 bg-yellow-50",
    badgeColor: "bg-yellow-500"
  },
  {
    id: "em_andamento_pendencia",
    title: "Pendência",
    icon: FileText,
    color: "bg-orange-100 border-orange-200",
    headerColor: "text-orange-700 bg-orange-50",
    badgeColor: "bg-orange-500"
  },
  {
    id: "finalizado_concluido",
    title: "Finalizado",
    icon: CheckCircle,
    color: "bg-green-100 border-green-200",
    headerColor: "text-green-700 bg-green-50",
    badgeColor: "bg-green-500"
  }
]

export default function FechamentoKanban({ onViewFechamento }: FechamentoKanbanProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [dateFilter, setDateFilter] = useState("all")

  // Função para filtrar por data
  const filterByDate = (fechamento: any, filter: string) => {
    const fechamentoDate = new Date(fechamento.data)
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - fechamentoDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    switch (filter) {
      case "today":
        return diffDays <= 1
      case "week":
        return diffDays <= 7
      case "month":
        return diffDays <= 30
      default:
        return true
    }
  }

  // Filtrar fechamentos
  const filteredFechamentos = useMemo(() => {
    return mockFechamentos
      .filter(fechamento => {
        // Filtro por texto
        const matchesSearch = searchTerm === "" ||
          fechamento.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fechamento.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por data
        const matchesDate = filterByDate(fechamento, dateFilter)

        return matchesSearch && matchesDate
      })
      // Ordenar por data mais recente primeiro
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [searchTerm, dateFilter])

  // Agrupar fechamentos por status
  const groupedFechamentos = useMemo(() => {
    const grouped: Record<string, any[]> = {}

    kanbanColumns.forEach(column => {
      grouped[column.id] = filteredFechamentos.filter(f => f.status === column.id)
    })

    return grouped
  }, [filteredFechamentos])

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="px-6 py-2 sm:py-3">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <span className="hidden sm:inline">Kanban dos Fechamentos</span>
              <span className="sm:hidden">Kanban</span>
              <Badge variant="outline" className="text-xs">
                {filteredFechamentos.length}
              </Badge>
            </CardTitle>
          </div>

          {/* Filtros */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 -mb-1">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Busque por fechamento de caixa..."
                className="pl-10 text-sm h-9 sm:h-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filtros em linha */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="text-sm !h-9 sm:!h-10 !px-3 items-center w-full sm:w-auto sm:min-w-[120px]">
                  <SelectValue placeholder="Todas as Datas" />
                </SelectTrigger>
                <SelectContent>
                  {dateRangeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 py-2 sm:py-3">
        {filteredFechamentos.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Nenhum fechamento encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Tente ajustar os filtros ou termos de busca.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {kanbanColumns.map(column => {
                const Icon = column.icon
                const items = groupedFechamentos[column.id] || []

                return (
                  <div key={column.id} className="flex flex-col overflow-hidden">
                    {/* Header da coluna */}
                    <div className={`${column.headerColor} rounded-t-lg p-3 border-b min-h-[60px] flex items-center`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2 min-w-0">
                          <Icon className="h-4 w-4 flex-shrink-0" />
                          <span className="font-medium text-sm truncate">{column.title}</span>
                        </div>
                        <Badge className={`${column.badgeColor} text-white text-xs px-2 py-1 flex-shrink-0 ml-2`}>
                          {items.length}
                        </Badge>
                      </div>
                    </div>

                    {/* Cards da coluna */}
                    <div className={`${column.color} rounded-b-lg p-2 flex-1 min-h-[400px] overflow-hidden`}>
                      {items.length === 0 ? (
                        <div className="text-center text-muted-foreground text-sm py-8 min-h-[200px] flex items-center justify-center">
                          Nenhum item
                        </div>
                      ) : (
                        <div className="max-h-96 overflow-y-auto space-y-2 overflow-x-hidden">
                          {items.map(fechamento => (
                            <div key={fechamento.id} className="w-full overflow-hidden">
                              <FechamentoCard
                                fechamento={fechamento}
                                onView={onViewFechamento}
                                onApprove={(f) => console.log('Aprovar:', f)}
                                onRequestCorrection={(f) => console.log('Solicitar correção:', f)}
                                onViewComments={(f) => console.log('Ver comentários:', f)}
                                compact={true}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
