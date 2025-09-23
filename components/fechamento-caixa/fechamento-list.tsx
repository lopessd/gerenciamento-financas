"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter, ChevronLeft, ChevronRight, Building2, MessageSquare, CheckCircle, FileMinus, AlertTriangle, FileSearch, XOctagon } from "lucide-react"

interface FechamentoListProps {
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

const ITEMS_PER_PAGE = 10

const getStatusBadge = (status: string) => {
  const variants = {
    sem_envio_aguardando: { className: "bg-gray-100 text-gray-700", label: "Aguardando" },
    sem_envio_atrasado: { className: "bg-red-100 text-red-700", label: "Atrasado" },
    em_andamento_analise: { className: "bg-blue-100 text-blue-700", label: "Em Análise" },
    em_andamento_pendencia: { className: "bg-orange-100 text-orange-700", label: "Pendência" },
    finalizado_concluido: { className: "bg-green-100 text-green-700", label: "Finalizado" },
  }

  const config = variants[status as keyof typeof variants] || variants.sem_envio_aguardando
  return (
    <Badge variant="status" className={config.className}>
      {config.label}
    </Badge>
  )
}

const getFinalizacaoIcon = (tipoFinalizacao?: string) => {
  if (!tipoFinalizacao) return null

  const tipos = {
    concluido_sem_divergencia: {
      icon: CheckCircle,
      className: "text-green-600",
      tooltip: "Concluído – Sem Divergências"
    },
    concluido_sem_movimento: {
      icon: FileMinus,
      className: "text-green-600",
      tooltip: "Concluído – Sem Movimento"
    },
    parcialmente_concluido_conferencia: {
      icon: FileSearch,
      className: "text-yellow-600",
      tooltip: "Parcial – Conferência Parcial"
    },
    parcialmente_concluido_divergencias: {
      icon: AlertTriangle,
      className: "text-yellow-600",
      tooltip: "Parcial – Divergências Justificadas"
    },
    quebra_caixa: {
      icon: XOctagon,
      className: "text-red-600",
      tooltip: "Quebra de Caixa"
    },
  }

  const config = tipos[tipoFinalizacao as keyof typeof tipos]
  if (!config) return null

  const IconComponent = config.icon
  return (
    <div className="relative group inline-block">
      <IconComponent className={`h-4 w-4 ${config.className}`} />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {config.tooltip}
      </div>
    </div>
  )
}

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "sem_envio_aguardando", label: "Aguardando" },
  { value: "sem_envio_atrasado", label: "Atrasado" },
  { value: "em_andamento_analise", label: "Em Análise" },
  { value: "em_andamento_pendencia", label: "Pendência" },
  { value: "finalizado_concluido", label: "Finalizado" },
]

const dateRangeOptions = [
  { value: "all", label: "Todas as Datas" },
  { value: "today", label: "Hoje" },
  { value: "week", label: "Últimos 7 dias" },
  { value: "month", label: "Últimos 30 dias" },
]

const tipoFinalizacaoOptions = [
  { value: "all", label: "Todos os Tipos" },
  { value: "concluido_sem_divergencia", label: "Concluído – Sem Divergências" },
  { value: "concluido_sem_movimento", label: "Concluído – Sem Movimento" },
  { value: "parcialmente_concluido_conferencia", label: "Parcial – Conferência Parcial" },
  { value: "parcialmente_concluido_divergencias", label: "Parcial – Divergências Justificadas" },
  { value: "quebra_caixa", label: "Quebra de Caixa" },
]


export default function FechamentoList({ onViewFechamento }: FechamentoListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [tipoFinalizacaoFilter, setTipoFinalizacaoFilter] = useState("all")

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

  // Filtrar e ordenar fechamentos
  const filteredFechamentos = useMemo(() => {
    return mockFechamentos
      .filter(fechamento => {
        // Filtro por texto
        const matchesSearch = searchTerm === "" ||
          fechamento.empresa.toLowerCase().includes(searchTerm.toLowerCase()) ||
          fechamento.responsavel.toLowerCase().includes(searchTerm.toLowerCase())

        // Filtro por status
        const matchesStatus = statusFilter === "all" || fechamento.status === statusFilter

        // Filtro por data
        const matchesDate = filterByDate(fechamento, dateFilter)

        // Filtro por tipo de finalização (só aplica se status for finalizado)
        const matchesTipoFinalizacao = tipoFinalizacaoFilter === "all" ||
          (fechamento.status === "finalizado_concluido" && fechamento.tipoFinalizacao === tipoFinalizacaoFilter)

        return matchesSearch && matchesStatus && matchesDate && matchesTipoFinalizacao
      })
      // Ordenar por data mais recente primeiro
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [searchTerm, statusFilter, dateFilter, tipoFinalizacaoFilter])

  // Paginação
  const totalPages = Math.ceil(filteredFechamentos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedFechamentos = filteredFechamentos.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset da página quando filtros mudam
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, dateFilter, tipoFinalizacaoFilter])

  // Reset do filtro de tipo de finalização quando status não for finalizado
  useMemo(() => {
    if (statusFilter !== "finalizado_concluido") {
      setTipoFinalizacaoFilter("all")
    }
  }, [statusFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="px-6 py-2 sm:py-3">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <span className="hidden sm:inline">Lista de Fechamentos</span>
              <span className="sm:hidden">Fechamentos</span>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="text-sm !h-9 sm:!h-10 !px-3 items-center w-full sm:w-auto sm:min-w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Filtro de tipo de finalização - só aparece quando status for finalizado */}
              {statusFilter === "finalizado_concluido" && (
                <Select value={tipoFinalizacaoFilter} onValueChange={setTipoFinalizacaoFilter}>
                  <SelectTrigger className="text-sm !h-9 sm:!h-10 !px-3 items-center w-full sm:w-auto sm:min-w-[180px]">
                    <SelectValue placeholder="Tipo de Finalização" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoFinalizacaoOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="text-sm !h-9 sm:!h-10 !px-3 items-center w-full sm:w-auto sm:min-w-[120px]">
                  <SelectValue placeholder="Período" />
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
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setDateFilter("all")
                setTipoFinalizacaoFilter("all")
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Empresa</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Valor</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Responsável</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Comentários</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedFechamentos.map((fechamento, index) => (
                      <tr
                        key={fechamento.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}
                        onClick={() => onViewFechamento?.(fechamento)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                            <span className="font-medium text-gray-900">{fechamento.empresa}</span>
                            {fechamento.status === "finalizado_concluido" && fechamento.tipoFinalizacao && (
                              <div className="ml-1">
                                {getFinalizacaoIcon(fechamento.tipoFinalizacao)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <Calendar className="h-3 w-3 flex-shrink-0" />
                            <span>{new Date(fechamento.data).toLocaleDateString("pt-BR")}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-gray-900">{fechamento.valor}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-600">{fechamento.responsavel}</span>
                        </td>
                        <td className="py-3 px-4">
                          {getStatusBadge(fechamento.status)}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {fechamento.comentarios > 0 && (
                            <div className="flex items-center justify-center gap-1 text-sm text-blue-600">
                              <MessageSquare className="h-3 w-3 flex-shrink-0" />
                              <span>{fechamento.comentarios}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewFechamento?.(fechamento)
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <Search className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile/Tablet Cards */}
            <div className="lg:hidden space-y-3">
              {paginatedFechamentos.map((fechamento) => (
                <div
                  key={fechamento.id}
                  className="border border-gray-200 rounded-lg p-3 bg-white hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => onViewFechamento?.(fechamento)}
                >
                  <div className="flex flex-col space-y-2">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="font-medium text-sm truncate">{fechamento.empresa}</span>
                        {fechamento.status === "finalizado_concluido" && fechamento.tipoFinalizacao && (
                          <div className="ml-1">
                            {getFinalizacaoIcon(fechamento.tipoFinalizacao)}
                          </div>
                        )}
                      </div>
                      {getStatusBadge(fechamento.status)}
                    </div>

                    {/* Info */}
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 flex-shrink-0" />
                        <span>{new Date(fechamento.data).toLocaleDateString("pt-BR")}</span>
                      </div>
                      <span className="font-medium">{fechamento.valor}</span>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{fechamento.responsavel}</span>
                      {fechamento.comentarios > 0 && (
                        <div className="flex items-center gap-1 text-blue-600">
                          <MessageSquare className="h-3 w-3 flex-shrink-0" />
                          <span>{fechamento.comentarios}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="pt-4 sm:pt-6 border-t space-y-3">
                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                  {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredFechamentos.length)} de {filteredFechamentos.length}
                </div>

                <div className="flex items-center justify-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 px-2 sm:px-3"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Anterior</span>
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      let page;
                      if (totalPages <= 5) {
                        page = i + 1;
                      } else if (currentPage <= 3) {
                        page = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        page = totalPages - 4 + i;
                      } else {
                        page = currentPage - 2 + i;
                      }

                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="w-7 h-7 sm:w-8 sm:h-8 p-0 text-xs sm:text-sm"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 px-2 sm:px-3"
                  >
                    <span className="hidden sm:inline">Próximo</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
