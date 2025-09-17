"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, CheckCircle, AlertCircle, MessageSquare, Edit } from "lucide-react"

export default function ConciliacaoConferencia() {
  const [searchTerm, setSearchTerm] = useState("")

  const lancamentos = [
    {
      id: 1,
      data: "15/01/2025",
      descricao: "PIX RECEBIDO - CLIENTE ABC LTDA",
      valor: 2500.0,
      tipo: "credito",
      status: "pendente",
      observacoes: "",
    },
    {
      id: 2,
      data: "15/01/2025",
      descricao: "TED ENVIADA - FORNECEDOR XYZ",
      valor: -1200.0,
      tipo: "debito",
      status: "conciliado",
      observacoes: "Pagamento aprovado",
    },
    {
      id: 3,
      data: "14/01/2025",
      descricao: "TARIFA BANCÁRIA",
      valor: -15.5,
      tipo: "debito",
      status: "divergencia",
      observacoes: "Valor divergente do esperado",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "conciliado":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "divergencia":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por descrição..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabela de Lançamentos converted to responsive cards */}
      <div className="space-y-4">
        {lancamentos.map((lancamento) => (
          <Card key={lancamento.id} className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-3">
                {/* Header with date and status */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-muted-foreground">{lancamento.data}</span>
                    <Badge variant="status" className={getStatusColor(lancamento.status)}>{lancamento.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${lancamento.valor > 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(lancamento.valor)}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <p className="text-sm font-medium text-foreground">{lancamento.descricao}</p>
                  {lancamento.observacoes && (
                    <p className="text-sm text-muted-foreground mt-1">{lancamento.observacoes}</p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                    <Edit className="h-4 w-4" />
                    <span className="hidden sm:inline">Editar</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
                    <MessageSquare className="h-4 w-4" />
                    <span className="hidden sm:inline">Comentar</span>
                  </Button>
                  {lancamento.status === "pendente" && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Conciliar</span>
                    </Button>
                  )}
                  {lancamento.status === "divergencia" && (
                    <Button size="sm" variant="destructive" className="flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Revisar</span>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
