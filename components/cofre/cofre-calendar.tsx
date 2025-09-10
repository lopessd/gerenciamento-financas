"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ArrowUpCircle, ArrowDownCircle } from "lucide-react"

const statusColors = {
  concluido: "bg-green-500",
  pendente: "bg-orange-500",
  revisao: "bg-yellow-500",
  atrasado: "bg-red-500",
}

const mockData = {
  "2025-01-15": [
    { tipo: "entrada", valor: "R$ 2.500", status: "concluido" },
    { tipo: "saida", valor: "R$ 800", status: "concluido" },
  ],
  "2025-01-16": [{ tipo: "entrada", valor: "R$ 1.200", status: "pendente" }],
  "2025-01-17": [
    { tipo: "saida", valor: "R$ 450", status: "atrasado" },
    { tipo: "transferencia", valor: "R$ 1.000", status: "revisao" },
  ],
  "2025-01-18": [{ tipo: "entrada", valor: "R$ 3.200", status: "concluido" }],
  "2025-01-20": [
    { tipo: "saida", valor: "R$ 650", status: "pendente" },
    { tipo: "entrada", valor: "R$ 890", status: "concluido" },
  ],
}

export default function CofreCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

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
            const dayMovements = mockData[dateKey] || []

            return (
              <div
                key={day}
                className="relative p-2 min-h-[100px] border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
              >
                <div className="text-sm font-medium mb-2">{day}</div>
                <div className="space-y-1">
                  {dayMovements.map((movement, idx) => (
                    <div key={idx} className="flex items-center gap-1">
                      {movement.tipo === "entrada" && <ArrowUpCircle className="h-3 w-3 text-green-500" />}
                      {movement.tipo === "saida" && <ArrowDownCircle className="h-3 w-3 text-red-500" />}
                      <div className={`w-2 h-2 rounded-full ${statusColors[movement.status]}`} />
                      <span className="text-xs truncate">{movement.valor}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">Entrada</span>
          </div>
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-4 w-4 text-red-500" />
            <span className="text-sm">Saída</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm">Concluído</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-sm">Pendente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-sm">Em Revisão</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm">Atrasado</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
