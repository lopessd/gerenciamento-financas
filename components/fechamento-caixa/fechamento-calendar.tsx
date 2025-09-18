"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, CheckCircle, FileMinus, AlertTriangle, FileSearch, XOctagon } from "lucide-react"
import DayViewModal from "./day-view-modal"

const statusColors = {
  sem_envio_aguardando: "border-l-gray-400 bg-gray-100/60",
  sem_envio_atrasado: "border-l-red-500 bg-red-100/60",
  em_andamento_analise: "border-l-blue-500 bg-blue-100/60",
  em_andamento_pendencia: "border-l-orange-500 bg-orange-100/60",
  finalizado_concluido: "border-l-green-500 bg-green-100/60",
}

// Dados de setembro 2025 (dias úteis apenas - finais de semana ficam em branco)
// Status "aguardando" e "atrasado" são status do DIA, não de fechamentos específicos
const mockData: Record<string, { status?: keyof typeof statusColors; empresa?: string; tipoFinalizacao?: string }[]> = {
  // Setembro - Semana 1 (1-5, segunda a sexta)
  "2025-09-01": [{ status: "finalizado_concluido", empresa: "Supermercado ABC", tipoFinalizacao: "concluido_sem_divergencia" }],
  "2025-09-02": [{ status: "finalizado_concluido", empresa: "Farmácia XYZ", tipoFinalizacao: "parcialmente_concluido_divergencias" }],
  "2025-09-03": [{ status: "em_andamento_pendencia", empresa: "Loja de Roupas DEF" }],
  "2025-09-04": [{ status: "finalizado_concluido", empresa: "Padaria GHI", tipoFinalizacao: "concluido_sem_movimento" }],
  "2025-09-05": [{ status: "em_andamento_analise", empresa: "Mercado JKL" }],
  // 6 e 7 são sábado/domingo - sem dados

  // Setembro - Semana 2 (8-12, segunda a sexta)
  "2025-09-08": [{ status: "finalizado_concluido", empresa: "Auto Peças MNO", tipoFinalizacao: "quebra_caixa" }],
  "2025-09-09": [
    { status: "finalizado_concluido", empresa: "Livraria PQR", tipoFinalizacao: "concluido_sem_divergencia" },
    { status: "em_andamento_analise", empresa: "Restaurante Bella Vista" }
  ],
  "2025-09-10": [{ status: "em_andamento_analise", empresa: "Hamburgueria STU" }],
  "2025-09-11": [{ status: "finalizado_concluido", empresa: "Floricultura VWX", tipoFinalizacao: "parcialmente_concluido_conferencia" }],
  "2025-09-12": [{ status: "em_andamento_pendencia", empresa: "Papelaria YZA" }],
  // 13 e 14 são sábado/domingo - sem dados

  // Setembro - Semana 3 (15-17, segunda a quarta)
  "2025-09-15": [{ status: "finalizado_concluido", empresa: "Salão de Beleza BCD", tipoFinalizacao: "concluido_sem_divergencia" }],
  "2025-09-16": [{ status: "em_andamento_analise", empresa: "Oficina EFG" }],

  // Dias sem fechamento (status do dia, não de empresas específicas)
  "2025-09-17": [{ status: "sem_envio_aguardando" }], // Dia atual, aguardando envio

  // Dias anteriores que ficaram sem envio (atrasados)
  "2025-09-13": [{ status: "sem_envio_atrasado" }], // Dia passou, sem envio (atrasado)
  "2025-09-06": [{ status: "sem_envio_atrasado" }], // Dia passou, sem envio (atrasado)
}

export default function FechamentoCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date()) // Mês atual considerando fuso horário
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isDayModalOpen, setIsDayModalOpen] = useState(false)

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const formatDateKey = (day: number) => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentDate.getMonth() &&
      today.getFullYear() === currentDate.getFullYear()
    )
  }

  const isWeekend = (day: number) => {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dayOfWeek = date.getDay()
    return dayOfWeek === 0 || dayOfWeek === 6 // domingo (0) ou sábado (6)
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
        <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${config.className}`} />
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
          {config.tooltip}
        </div>
      </div>
    )
  }

  const getTodayBorderColor = (dayData: { status?: keyof typeof statusColors; empresa?: string }[] | undefined) => {
    if (!dayData || dayData.length === 0 || !dayData[0].status) {
      return "border-gray-600" // cor do texto quando não há status
    }

    // Priorizar status mais críticos para a cor da borda do dia atual
    const hasAtrasado = dayData.some(d => d.status === "sem_envio_atrasado")
    const hasPendencia = dayData.some(d => d.status === "em_andamento_pendencia")
    const hasAnalise = dayData.some(d => d.status === "em_andamento_analise")
    const hasConcluido = dayData.some(d => d.status === "finalizado_concluido")
    const hasAguardando = dayData.some(d => d.status === "sem_envio_aguardando")

    if (hasAtrasado) return "border-red-500"
    if (hasPendencia) return "border-orange-500"
    if (hasAnalise) return "border-blue-500"
    if (hasAguardando) return "border-gray-400"
    if (hasConcluido) return "border-green-500"

    return "border-gray-600"
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const year = prev.getFullYear()
      const month = prev.getMonth()

      if (direction === "prev") {
        if (month === 0) {
          // Janeiro -> Dezembro do ano anterior
          return new Date(year - 1, 11, 1)
        } else {
          return new Date(year, month - 1, 1)
        }
      } else {
        if (month === 11) {
          // Dezembro -> Janeiro do próximo ano
          return new Date(year + 1, 0, 1)
        } else {
          return new Date(year, month + 1, 1)
        }
      }
    })
  }

  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  return (
    <Card className="border-0 shadow-md bg-white">
      <CardHeader className="bg-white border-b border-gray-200 py-3 sm:py-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg sm:text-xl text-gray-900">
            <span className="hidden sm:inline">{monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}</span>
            <span className="sm:hidden">{monthNames[currentDate.getMonth()].substring(0, 3)} {currentDate.getFullYear()}</span>
          </CardTitle>
          <div className="flex gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("prev")}
              className="h-7 w-7 sm:h-9 sm:w-9 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigateMonth("next")}
              className="h-7 w-7 sm:h-9 sm:w-9 border-gray-300 text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
  <CardContent className="py-3 sm:py-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold text-green-700 p-1 sm:p-2 bg-green-50/50 rounded-lg">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.substring(0, 1)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {getDaysInMonth(currentDate).map((day, index) => {
            if (!day) {
              return <div key={index} className="p-1 sm:p-2" />
            }

            const dateKey = formatDateKey(day)
            const dayData = mockData[dateKey]
            const today = isToday(day)
            const todayBorderColor = getTodayBorderColor(dayData)
            const weekend = isWeekend(day)

            // build classes explicitly to avoid accidental leftover border-left
            const base = [
              "relative p-1 sm:p-2 min-h-[50px] sm:min-h-[80px] border border-gray-200 rounded-lg transition-all duration-200",
            ]

            // Finais de semana ficam em branco sem status e sem cursor pointer
            if (weekend) {
              base.push("bg-gray-50/30")
            } else if (!dayData || dayData.length === 0) {
              base.push("bg-white hover:bg-gray-50 cursor-pointer")
            } else {
              // Determinar status mais crítico para exibir a cor da borda
              const hasAtrasado = dayData.some(d => d.status === "sem_envio_atrasado")
              const hasPendencia = dayData.some(d => d.status === "em_andamento_pendencia")
              const hasAnalise = dayData.some(d => d.status === "em_andamento_analise")
              const hasAguardando = dayData.some(d => d.status === "sem_envio_aguardando")
              const hasConcluido = dayData.some(d => d.status === "finalizado_concluido")

              let statusColor = "bg-white"
              if (hasAtrasado) statusColor = statusColors.sem_envio_atrasado
              else if (hasPendencia) statusColor = statusColors.em_andamento_pendencia
              else if (hasAnalise) statusColor = statusColors.em_andamento_analise
              else if (hasAguardando) statusColor = statusColors.sem_envio_aguardando
              else if (hasConcluido) statusColor = statusColors.finalizado_concluido

              base.push("border-l-2 sm:border-l-4", statusColor, "hover:shadow-md cursor-pointer")
            }

            return (
              <div
                key={day}
                className={base.join(" ")}
                onClick={weekend ? undefined : () => {
                  const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  setSelectedDate(clickedDate)
                  setIsDayModalOpen(true)
                }}
              >
                <div className="flex flex-col items-center gap-1">
                  <div className={`text-xs sm:text-sm font-medium ${today ? `inline-flex items-center justify-center w-5 h-5 sm:w-6 sm:h-6 border-2 ${todayBorderColor} rounded-full` : ""}`}>
                    {day}
                  </div>
                  {/* Ícone de finalização */}
                  {dayData && dayData.some(d => d.status === "finalizado_concluido") && (
                    <div className="flex justify-center">
                      {getFinalizacaoIcon(dayData.find(d => d.status === "finalizado_concluido")?.tipoFinalizacao)}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-green-100 space-y-4">
          {/* Status Legend */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Status dos Fechamentos</h4>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm text-green-700 font-medium">Finalizado</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 shadow-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm text-blue-700 font-medium">Em Análise</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500 shadow-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm text-orange-700 font-medium">Pendência</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm text-red-700 font-medium">Atrasado</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 shadow-sm flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-600 font-medium">Aguardando</span>
              </div>
            </div>
          </div>

          {/* Icons Legend */}
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">Tipos de Finalização</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-wrap gap-2 sm:gap-4">
              <div className="flex items-center gap-1 sm:gap-2">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Sem Divergências</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <FileMinus className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Sem Movimento</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <FileSearch className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Conferência Parcial</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Divergências Justificadas</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <XOctagon className="h-3 w-3 sm:h-4 sm:w-4 text-red-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm text-gray-700">Quebra de Caixa</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Day View Modal */}
      {selectedDate && (
        <DayViewModal
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          selectedDate={selectedDate!}
          onDateChange={setSelectedDate}
        />
      )}
    </Card>
  )
}
