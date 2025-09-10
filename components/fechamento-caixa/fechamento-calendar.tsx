"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const statusColors = {
  conciliado: "bg-green-500",
  pendente: "bg-orange-500",
  atrasado: "bg-red-500",
  sem_envio: "bg-gray-300",
}

const mockData = {
  "2025-01-15": { status: "conciliado", empresa: "Supermercado ABC" },
  "2025-01-16": { status: "pendente", empresa: "Farmácia XYZ" },
  "2025-01-17": { status: "atrasado", empresa: "Loja DEF" },
  "2025-01-18": { status: "conciliado", empresa: "Padaria GHI" },
  "2025-01-20": { status: "sem_envio", empresa: "Mercado JKL" },
}

export default function FechamentoCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1)) // Janeiro 2025

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
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {getDaysInMonth(currentDate).map((day, index) => {
            if (!day) {
              return <div key={index} className="p-2" />
            }

            const dateKey = formatDateKey(day)
            const dayData = mockData[dateKey]

            return (
              <div
                key={day}
                className="relative p-2 min-h-[80px] border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="text-sm font-medium mb-1">{day}</div>
                {dayData && (
                  <div className="space-y-1">
                    <div className={`w-3 h-3 rounded-full ${statusColors[dayData.status]}`} />
                    <div className="text-xs text-muted-foreground truncate">{dayData.empresa}</div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Conciliado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm">Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Atrasado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <span className="text-sm">Sem Envio</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
