"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import DayViewModal from "./day-view-modal"

const statusColors = {
  conciliado: "border-l-green-500 bg-green-100/60",
  pendente: "border-l-orange-500 bg-orange-100/60", 
  atrasado: "border-l-red-500 bg-red-100/60",
  sem_envio: "border-l-gray-400 bg-gray-100/60",
}

const mockData: Record<string, { status: keyof typeof statusColors; empresa: string }> = {
  "2025-01-15": { status: "conciliado", empresa: "Supermercado ABC" },
  "2025-01-16": { status: "pendente", empresa: "Farmácia XYZ" },
  "2025-01-17": { status: "atrasado", empresa: "Loja DEF" },
  "2025-01-18": { status: "conciliado", empresa: "Padaria GHI" },
  "2025-01-20": { status: "sem_envio", empresa: "Mercado JKL" },
}

export default function FechamentoCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)) // Janeiro 2025
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

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
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
      <CardHeader className="bg-white border-b border-gray-200 p-3 sm:p-6">
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
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 sm:mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-xs sm:text-sm font-semibold text-green-700 p-1 sm:p-2 bg-green-50/50 rounded">
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

            return (
              <div
                key={day}
                className={`relative p-1 sm:p-2 min-h-[50px] sm:min-h-[80px] border border-gray-200 rounded cursor-pointer transition-all duration-200 border-l-2 sm:border-l-4 ${
                  dayData
                    ? `${statusColors[dayData.status]} hover:shadow-md`
                    : "bg-white border-l-transparent hover:bg-gray-50"
                }`}
                onClick={() => {
                  const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
                  setSelectedDate(clickedDate)
                  setIsDayModalOpen(true)
                }}
              >
                <div className="text-xs sm:text-sm font-medium">{day}</div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-green-100">
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 shadow-sm flex-shrink-0" />
            <span className="text-xs sm:text-sm text-green-700 font-medium">Conciliado</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500 shadow-sm flex-shrink-0" />
            <span className="text-xs sm:text-sm text-orange-700 font-medium">Pendente</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 shadow-sm flex-shrink-0" />
            <span className="text-xs sm:text-sm text-red-700 font-medium">Atrasado</span>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 shadow-sm flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 font-medium">Sem Envio</span>
          </div>
        </div>
      </CardContent>
      
      {/* Day View Modal */}
      {selectedDate && (
        <DayViewModal
          isOpen={isDayModalOpen}
          onClose={() => setIsDayModalOpen(false)}
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />
      )}
    </Card>
  )
}
