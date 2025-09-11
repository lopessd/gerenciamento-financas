"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, MessageSquare, RotateCcw, CheckCircle, Search, Calendar, Building2 } from "lucide-react"

const mockFechamentos = [
  {
    id: 1,
    empresa: "Supermercado ABC",
    data: "2025-01-15",
    valor: "R$ 12.450,00",
    status: "conciliado",
    responsavel: "João Silva",
    comentarios: 2,
  },
  {
    id: 2,
    empresa: "Farmácia XYZ",
    data: "2025-01-16",
    valor: "R$ 3.280,00",
    status: "pendente",
    responsavel: "Maria Santos",
    comentarios: 1,
  },
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
    empresa: "Padaria GHI",
    data: "2025-01-18",
    valor: "R$ 1.890,00",
    status: "conciliado",
    responsavel: "Ana Lima",
    comentarios: 0,
  },
  {
    id: 5,
    empresa: "Mercado JKL",
    data: "2025-01-20",
    valor: "Não informado",
    status: "sem_envio",
    responsavel: "-",
    comentarios: 0,
  },
]

const getStatusBadge = (status: string) => {
  const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline", className: string, label: string }> = {
    conciliado: { variant: "default" as const, className: "bg-green-100 text-green-700", label: "Conciliado" },
    pendente: { variant: "secondary" as const, className: "bg-orange-100 text-orange-700", label: "Pendente" },
    atrasado: { variant: "destructive" as const, className: "", label: "Atrasado" },
    sem_envio: { variant: "outline" as const, className: "bg-gray-100 text-gray-700", label: "Sem Envio" },
  }

  const config = variants[status] || variants.sem_envio
  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  )
}

export default function FechamentoList() {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Lista de Fechamentos</CardTitle>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar empresa..." className="pl-10 w-64" />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockFechamentos.map((fechamento) => (
            <Card key={fechamento.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{fechamento.empresa}</span>
                      {getStatusBadge(fechamento.status)}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(fechamento.data).toLocaleDateString("pt-BR")}
                      </div>
                      <div>
                        <span className="font-medium text-foreground">{fechamento.valor}</span>
                      </div>
                      <div>Resp: {fechamento.responsavel}</div>
                      <div className="flex items-center gap-1">
                        {fechamento.comentarios > 0 && (
                          <>
                            <MessageSquare className="h-3 w-3" />
                            <span>{fechamento.comentarios}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {fechamento.status === "pendente" && (
                      <>
                        <Button variant="ghost" size="icon">
                          <RotateCcw className="h-4 w-4 text-orange-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
