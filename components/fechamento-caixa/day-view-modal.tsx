"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import FechamentoCard from "./fechamento-card"
import VisualizarFechamentoModal from "./visualizar-fechamento-modal"

interface DayViewModalProps {
  isOpen: boolean
  onClose: () => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}

// Mock data para setembro 2025 - pode ter múltiplos fechamentos por dia
const mockFechamentos: Record<string, any[]> = {
  "2025-09-01": [
    {
      id: "1",
      data: "2025-09-01",
      titulo: "Fechamento Diário",
      empresa: "Supermercado ABC",
      responsavel: "João Silva",
      status: "COMPLETED",
      saldoAbertura: 1000.00,
      vendas: {
        boleto: 2500.50,
        dinheiro: 4200.00,
        cartaoDebito: 3150.75,
        cartaoCredito: 3800.25,
        pix: 1250.00,
        transferencia: 549.50,
        outros: 0.00,
        total: 15450.00
      },
      suprimento: 500.00,
      sangrias: 200.00,
      saldoFinal: 16750.00,
      observacoes: "Movimento normal do dia",
      tipoFinalizacao: "concluido_sem_divergencia",
      anexos: [],
      comentarios: 2,
    }
  ],
  "2025-09-02": [{
    id: "2",
    data: "2025-09-02",
    titulo: "Fechamento Diário",
    empresa: "Farmácia XYZ",
    responsavel: "Maria Santos",
    status: "COMPLETED",
    saldoAbertura: 600.00,
    vendas: {
      boleto: 1200.00,
      dinheiro: 1800.00,
      cartaoDebito: 800.00,
      cartaoCredito: 480.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 4280.00
    },
    suprimento: 100.00,
    sangrias: 150.00,
    saldoFinal: 4730.00,
    observacoes: "Movimento típico de farmácia",
    tipoFinalizacao: "parcialmente_concluido_divergencias",
    anexos: [],
    comentarios: 1,
  }],
  "2025-09-03": [
    {
      id: "3",
      data: "2025-09-03",
      titulo: "Fechamento Diário",
      empresa: "Loja de Roupas DEF",
      responsavel: "Pedro Costa",
      status: "RETURNED",
      saldoAbertura: 750.00,
      vendas: {
        boleto: 0.00,
        dinheiro: 2500.00,
        cartaoDebito: 3200.00,
        cartaoCredito: 3050.00,
        pix: 0.00,
        transferencia: 0.00,
        outros: 0.00,
        total: 8750.00
      },
      suprimento: 0.00,
      sangrias: 400.00,
      saldoFinal: 9100.00,
      observacoes: "Pendência: divergência no valor de cartão",
      anexos: [],
      comentarios: 3,
    }
  ],
  "2025-09-04": [{
    id: "4",
    data: "2025-09-04",
    titulo: "Fechamento Diário",
    empresa: "Padaria GHI",
    responsavel: "Ana Lima",
    status: "COMPLETED",
    saldoAbertura: 300.00,
    vendas: {
      boleto: 0.00,
      dinheiro: 2000.00,
      cartaoDebito: 600.00,
      cartaoCredito: 290.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 2890.00
    },
    suprimento: 0.00,
    sangrias: 200.00,
    saldoFinal: 2990.00,
    observacoes: "Dia normal de funcionamento",
    tipoFinalizacao: "concluido_sem_movimento",
    anexos: [],
    comentarios: 0,
  }],
  "2025-09-05": [{
    id: "5",
    data: "2025-09-05",
    titulo: "Fechamento Diário",
    empresa: "Mercado JKL",
    responsavel: "Carlos Souza",
    status: "IN_REVIEW",
    saldoAbertura: 800.00,
    vendas: {
      boleto: 1500.00,
      dinheiro: 2200.00,
      cartaoDebito: 1700.00,
      cartaoCredito: 700.00,
      pix: 300.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 6200.00
    },
    suprimento: 200.00,
    sangrias: 300.00,
    saldoFinal: 6900.00,
    observacoes: "Em análise pelo operador",
    anexos: [],
    comentarios: 1,
  }],
  "2025-09-08": [{
    id: "6",
    data: "2025-09-08",
    titulo: "Fechamento Diário",
    empresa: "Auto Peças MNO",
    responsavel: "Fernanda Lima",
    status: "COMPLETED",
    saldoAbertura: 500.00,
    vendas: {
      boleto: 2000.00,
      dinheiro: 1500.00,
      cartaoDebito: 1200.00,
      cartaoCredito: 1100.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 5800.00
    },
    suprimento: 0.00,
    sangrias: 200.00,
    saldoFinal: 6100.00,
    observacoes: "Vendas de peças automotivas",
    tipoFinalizacao: "quebra_caixa",
    anexos: [],
    comentarios: 0,
  }],
  "2025-09-09": [
    {
      id: "7",
      data: "2025-09-09",
      titulo: "Fechamento Diário",
      empresa: "Livraria PQR",
      responsavel: "Roberto Santos",
      status: "COMPLETED",
      saldoAbertura: 500.00,
      vendas: {
        boleto: 800.00,
        dinheiro: 1200.00,
        cartaoDebito: 650.00,
        cartaoCredito: 450.00,
        pix: 50.00,
        transferencia: 0.00,
        outros: 0.00,
        total: 3150.00
      },
      suprimento: 0.00,
      sangrias: 100.00,
      saldoFinal: 3550.00,
      observacoes: "Dia de vendas moderadas",
      tipoFinalizacao: "concluido_sem_divergencia",
      anexos: [],
      comentarios: 2,
    },
    {
      id: "16",
      data: "2025-09-09",
      titulo: "Fechamento Diário",
      empresa: "Restaurante Bella Vista",
      responsavel: "Carla Mendes",
      status: "IN_REVIEW",
      saldoAbertura: 800.00,
      vendas: {
        boleto: 0.00,
        dinheiro: 3200.00,
        cartaoDebito: 2150.00,
        cartaoCredito: 2340.00,
        pix: 200.00,
        transferencia: 0.00,
        outros: 0.00,
        total: 7890.00
      },
      suprimento: 200.00,
      sangrias: 300.00,
      saldoFinal: 8590.00,
      observacoes: "Movimento intenso no jantar",
      anexos: [],
      comentarios: 1,
    }
  ],
  "2025-09-10": [{
    id: "8",
    data: "2025-09-10",
    titulo: "Fechamento Diário",
    empresa: "Hamburgueria STU",
    responsavel: "Patricia Oliveira",
    status: "IN_REVIEW",
    saldoAbertura: 400.00,
    vendas: {
      boleto: 0.00,
      dinheiro: 2800.00,
      cartaoDebito: 1200.00,
      cartaoCredito: 800.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 4800.00
    },
    suprimento: 100.00,
    sangrias: 250.00,
    saldoFinal: 5050.00,
    observacoes: "Movimento de final de semana",
    anexos: [],
    comentarios: 1,
  }],
  "2025-09-11": [{
    id: "9",
    data: "2025-09-11",
    titulo: "Fechamento Diário",
    empresa: "Floricultura VWX",
    responsavel: "Lucas Ferreira",
    status: "COMPLETED",
    saldoAbertura: 200.00,
    vendas: {
      boleto: 0.00,
      dinheiro: 1200.00,
      cartaoDebito: 450.00,
      cartaoCredito: 300.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 1950.00
    },
    suprimento: 0.00,
    sangrias: 100.00,
    saldoFinal: 2050.00,
    observacoes: "Vendas de flores e arranjos",
    tipoFinalizacao: "parcialmente_concluido_conferencia",
    anexos: [],
    comentarios: 0,
  }],
  "2025-09-12": [{
    id: "10",
    data: "2025-09-12",
    titulo: "Fechamento Diário",
    empresa: "Papelaria YZA",
    responsavel: "Camila Torres",
    status: "RETURNED",
    saldoAbertura: 300.00,
    vendas: {
      boleto: 0.00,
      dinheiro: 1500.00,
      cartaoDebito: 600.00,
      cartaoCredito: 300.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 2400.00
    },
    suprimento: 0.00,
    sangrias: 150.00,
    saldoFinal: 2550.00,
    observacoes: "Pendência: falta comprovante de sangria",
    anexos: [],
    comentarios: 2,
  }],
  "2025-09-15": [{
    id: "11",
    data: "2025-09-15",
    titulo: "Fechamento Diário",
    empresa: "Salão de Beleza BCD",
    responsavel: "Diego Alves",
    status: "COMPLETED",
    saldoAbertura: 400.00,
    vendas: {
      boleto: 0.00,
      dinheiro: 2000.00,
      cartaoDebito: 800.00,
      cartaoCredito: 800.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 3600.00
    },
    suprimento: 0.00,
    sangrias: 300.00,
    saldoFinal: 3700.00,
    observacoes: "Serviços de beleza e estética",
    tipoFinalizacao: "concluido_sem_divergencia",
    anexos: [],
    comentarios: 0,
  }],
  "2025-09-16": [{
    id: "12",
    data: "2025-09-16",
    titulo: "Fechamento Diário",
    empresa: "Oficina EFG",
    responsavel: "Beatriz Costa",
    status: "IN_REVIEW",
    saldoAbertura: 600.00,
    vendas: {
      boleto: 2500.00,
      dinheiro: 2800.00,
      cartaoDebito: 1200.00,
      cartaoCredito: 800.00,
      pix: 0.00,
      transferencia: 0.00,
      outros: 0.00,
      total: 7300.00
    },
    suprimento: 0.00,
    sangrias: 400.00,
    saldoFinal: 7500.00,
    observacoes: "Serviços automotivos diversos",
    anexos: [],
    comentarios: 1,
  }]
  // Dias 6, 13, 17 não têm fechamentos - aparecem como "atrasado" ou "aguardando" no calendário
}

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

export default function DayViewModal({ isOpen, onClose, selectedDate, onDateChange }: DayViewModalProps) {
  const { user } = useAuth()
  const [selectedFechamento, setSelectedFechamento] = useState<any>(null)
  const [isVisualizarModalOpen, setIsVisualizarModalOpen] = useState(false)
  
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

  const handleViewFechamento = (fechamento: any) => {
    setSelectedFechamento(fechamento)
    setIsVisualizarModalOpen(true)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden p-0 flex flex-col !rounded-xl" showCloseButton={false}>
  <DialogHeader className="px-6 py-4 border-b border-gray-200 flex-none rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-600" />
              <div>
                <DialogTitle className="text-lg font-semibold text-gray-900 capitalize">
                  {formattedDate}
                </DialogTitle>
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
        </DialogHeader>

  {/* Conteúdo (rolável internamente) */}
  <div className="px-6 py-4 overflow-y-auto flex-1">
          <div className="space-y-4">
            {fechamentos.length > 0 ? (
              fechamentos.map((fechamento) => (
                <FechamentoCard
                  key={fechamento.id}
                  fechamento={fechamento}
                  onView={handleViewFechamento}
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

  {/* Rodapé com botão fechar (fixo dentro do modal) */}
  <div className="border-t px-6 py-4 bg-gray-50 flex-none rounded-b-xl">
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClose}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>

      {/* Modal de Visualização do Fechamento */}
      {selectedFechamento && (
        <VisualizarFechamentoModal
          isOpen={isVisualizarModalOpen}
          onClose={() => {
            setIsVisualizarModalOpen(false)
            setSelectedFechamento(null)
          }}
          fechamento={selectedFechamento}
          userRole={user?.role === "admin" ? "operador" : (user?.role || "cliente")}
        />
      )}
    </Dialog>
  )
}
