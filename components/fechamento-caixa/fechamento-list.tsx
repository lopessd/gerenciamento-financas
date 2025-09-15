"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react"
import FechamentoCard from "./fechamento-card"

// Mock data expandido para demonstração de paginação
const mockFechamentos = [
  { id: 1, empresa: "Supermercado ABC", data: "2025-01-20", valor: "R$ 15.450,00", status: "pendente", responsavel: "João Silva", comentarios: 2 },
  { id: 2, empresa: "Farmácia XYZ", data: "2025-01-20", valor: "R$ 4.280,00", status: "conciliado", responsavel: "Maria Santos", comentarios: 1 },
  { id: 3, empresa: "Loja de Roupas DEF", data: "2025-01-19", valor: "R$ 8.750,00", status: "atrasado", responsavel: "Pedro Costa", comentarios: 3 },
  { id: 4, empresa: "Padaria GHI", data: "2025-01-19", valor: "R$ 2.890,00", status: "conciliado", responsavel: "Ana Lima", comentarios: 0 },
  { id: 5, empresa: "Mercado JKL", data: "2025-01-18", valor: "Não informado", status: "sem_envio", responsavel: "-", comentarios: 0 },
  { id: 6, empresa: "Auto Peças MNO", data: "2025-01-18", valor: "R$ 6.200,00", status: "pendente", responsavel: "Carlos Souza", comentarios: 1 },
  { id: 7, empresa: "Livraria PQR", data: "2025-01-17", valor: "R$ 3.150,00", status: "conciliado", responsavel: "Fernanda Lima", comentarios: 0 },
  { id: 8, empresa: "Hamburgueria STU", data: "2025-01-17", valor: "R$ 4.800,00", status: "atrasado", responsavel: "Roberto Santos", comentarios: 2 },
  { id: 9, empresa: "Floricultura VWX", data: "2025-01-16", valor: "R$ 1.950,00", status: "conciliado", responsavel: "Patricia Oliveira", comentarios: 0 },
  { id: 10, empresa: "Papelaria YZA", data: "2025-01-16", valor: "R$ 2.400,00", status: "pendente", responsavel: "Lucas Ferreira", comentarios: 1 },
  { id: 11, empresa: "Salão de Beleza BCD", data: "2025-01-15", valor: "R$ 3.600,00", status: "conciliado", responsavel: "Camila Torres", comentarios: 0 },
  { id: 12, empresa: "Oficina EFG", data: "2025-01-15", valor: "R$ 7.300,00", status: "atrasado", responsavel: "Diego Alves", comentarios: 4 },
  { id: 13, empresa: "Clínica HIJ", data: "2025-01-14", valor: "R$ 9.200,00", status: "conciliado", responsavel: "Beatriz Costa", comentarios: 0 },
  { id: 14, empresa: "Pet Shop KLM", data: "2025-01-14", valor: "Não informado", status: "sem_envio", responsavel: "-", comentarios: 0 },
  { id: 15, empresa: "Relojoaria NOP", data: "2025-01-13", valor: "R$ 1.800,00", status: "pendente", responsavel: "Eduardo Melo", comentarios: 1 },
]

const ITEMS_PER_PAGE = 5

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "pendente", label: "Pendente" },
  { value: "conciliado", label: "Conciliado" },
  { value: "atrasado", label: "Atrasado" },
  { value: "sem_envio", label: "Sem Envio" },
]

const dateRangeOptions = [
  { value: "all", label: "Todas as Datas" },
  { value: "today", label: "Hoje" },
  { value: "week", label: "Últimos 7 dias" },
  { value: "month", label: "Últimos 30 dias" },
]


export default function FechamentoList() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
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
        
        return matchesSearch && matchesStatus && matchesDate
      })
      // Ordenar por data mais recente primeiro
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
  }, [searchTerm, statusFilter, dateFilter])

  // Paginação
  const totalPages = Math.ceil(filteredFechamentos.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedFechamentos = filteredFechamentos.slice(startIndex, startIndex + ITEMS_PER_PAGE)

  // Reset da página quando filtros mudam
  useMemo(() => {
    setCurrentPage(1)
  }, [searchTerm, statusFilter, dateFilter])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
  
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              Lista de Fechamentos
              <Badge variant="outline" className="text-xs">
                {filteredFechamentos.length} {filteredFechamentos.length === 1 ? 'item' : 'itens'}
              </Badge>
            </CardTitle>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar empresa ou responsável..." 
                className="pl-10" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            {/* Filtro por Status */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Filtro por Data */}
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filtrar por data" />
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
      </CardHeader>
      <CardContent>
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
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {paginatedFechamentos.map((fechamento) => (
                <FechamentoCard 
                  key={fechamento.id} 
                  fechamento={fechamento}
                  onView={(f) => console.log('Visualizar:', f)}
                  onApprove={(f) => console.log('Aprovar:', f)}
                  onRequestCorrection={(f) => console.log('Solicitar correção:', f)}
                  onViewComments={(f) => console.log('Ver comentários:', f)}
                />
              ))}
            </div>
            
            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-6 border-t">
                <div className="text-sm text-muted-foreground">
                  Mostrando {startIndex + 1} a {Math.min(startIndex + ITEMS_PER_PAGE, filteredFechamentos.length)} de {filteredFechamentos.length} itens
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Anterior
                  </Button>
                  
                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    Próximo
                    <ChevronRight className="h-4 w-4" />
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
