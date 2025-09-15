"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import FechamentoCard from "./fechamento-card"

interface DayViewModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}

// Mock data - pode ter múltiplos fechamentos por dia
const mockFechamentos: Record<string, any[]> = {
  "2025-01-15": [{
    id: 1,
    empresa: "Supermercado ABC",
    data: "2025-01-15",
    valor: "R$ 12.450,00",
    status: "conciliado",
    responsavel: "João Silva",
    comentarios: 2,
  }],
  "2025-01-16": [{
    id: 2,
    empresa: "Farmácia XYZ", 
    data: "2025-01-16",
    valor: "R$ 3.280,00",
    status: "pendente",
    responsavel: "Maria Santos",
    comentarios: 1,
  }],
  "2025-01-17": [
    {
      id: 3,
      empresa: "Loja de Roupas DEF",
      data: "2025-01-17", 
      valor: "R$ 8.750,00",
      status: "atrasado",
      responsavel: "Pedro Costa",
      comentarios: 3,
    },
    {
      id: 4,
      empresa: "Filial Centro",
      data: "2025-01-17", 
      valor: "R$ 5.200,00",
      status: "conciliado",
      responsavel: "Ana Silva",
      comentarios: 0,
    }
  ]
}

const getStatusBadge = (status: string) => {
  const variants = {
    conciliado: { className: "bg-green-100 text-green-700", label: "Conciliado" },
    pendente: { className: "bg-orange-100 text-orange-700", label: "Pendente" },
    atrasado: { className: "bg-red-100 text-red-700", label: "Atrasado" },
    sem_envio: { className: "bg-gray-100 text-gray-700", label: "Sem Envio" },
  }

  const config = variants[status as keyof typeof variants] || variants.sem_envio
  return (
    <Badge className={config.className}>
      {config.label}
    </Badge>
  )
}

export default function DayViewModal({ isOpen, onClose, selectedDate, onDateChange }: DayViewModalProps) {
  const { user } = useAuth()
  
  const formatDateKey = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const day = date.getDate()
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const navigateDay = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate)
    if (direction === "prev") {
      newDate.setDate(selectedDate.getDate() - 1)
    } else {
      newDate.setDate(selectedDate.getDate() + 1)
    }
    onDateChange(newDate)
  }

  const dateKey = formatDateKey(selectedDate)
  const fechamentos = mockFechamentos[dateKey] || []
  
  const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric", 
    month: "long",
    day: "numeric"
  })

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden p-0 [&>button]:hidden">
        {/* Header com navegação */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-gray-600" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 capitalize">
                {formattedDate}
              </h2>
              <p className="text-sm text-gray-600">
                {fechamentos.length} fechamento{fechamentos.length !== 1 ? 's' : ''} encontrado{fechamentos.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateDay("prev")}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => navigateDay("next")}
              className="border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 max-h-[calc(85vh-140px)] overflow-y-auto">
          <div className="space-y-4">
            {fechamentos.length > 0 ? (
              fechamentos.map((fechamento) => (
                <FechamentoCard 
                  key={fechamento.id} 
                  fechamento={fechamento}
                  onView={(f) => console.log('Visualizar:', f)}
                  onApprove={(f) => console.log('Aprovar:', f)}
                  onRequestCorrection={(f) => console.log('Solicitar correção:', f)}
                  onViewComments={(f) => console.log('Ver comentários:', f)}
                />
              ))
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="p-8 text-center">
                  <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                      <Calendar className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Nenhum fechamento encontrado</h3>
                      <p className="text-muted-foreground">
                        {user?.role === "cliente" 
                          ? "Você ainda não registrou o fechamento para este dia."
                          : "O cliente ainda não enviou o fechamento para este dia."
                        }
                      </p>
                    </div>
                    {user?.role === "cliente" && (
                      <Button className="mt-4">
                        Registrar Fechamento
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Rodapé com botão fechar */}
        <div className="border-t p-4 bg-gray-50">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}