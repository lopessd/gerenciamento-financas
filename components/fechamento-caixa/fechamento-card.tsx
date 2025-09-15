"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, Building2, MessageSquare, MoreVertical, Eye, RotateCcw, CheckCircle } from "lucide-react"

interface FechamentoData {
  id: number
  empresa: string
  data: string
  valor: string
  status: "conciliado" | "pendente" | "atrasado" | "sem_envio"
  responsavel: string
  comentarios: number
}

interface FechamentoCardProps {
  fechamento: FechamentoData
  onView?: (fechamento: FechamentoData) => void
  onApprove?: (fechamento: FechamentoData) => void
  onRequestCorrection?: (fechamento: FechamentoData) => void
  onViewComments?: (fechamento: FechamentoData) => void
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

export default function FechamentoCard({ 
  fechamento, 
  onView, 
  onApprove, 
  onRequestCorrection, 
  onViewComments 
}: FechamentoCardProps) {
  const { user } = useAuth()

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{fechamento.empresa}</span>
                {getStatusBadge(fechamento.status)}
              </div>
              
              {/* Menu de três pontos */}
              <div className="relative">
                <CustomDropdown
                  trigger={
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  }
                  width={192}
                >
                  <CustomDropdownItem 
                    onClick={() => onView?.(fechamento)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Visualizar
                  </CustomDropdownItem>

                  {/* Ações apenas para operadores */}
                  {user?.role === "operador" && fechamento.status === "pendente" && (
                    <>
                      <CustomDropdownItem 
                        onClick={() => onRequestCorrection?.(fechamento)}
                        className="flex items-center gap-2 text-orange-600"
                      >
                        <RotateCcw className="h-4 w-4" />
                        Solicitar Correção
                      </CustomDropdownItem>
                      <CustomDropdownItem 
                        onClick={() => onApprove?.(fechamento)}
                        className="flex items-center gap-2 text-green-600"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Aprovar
                      </CustomDropdownItem>
                    </>
                  )}

                  {/* Comentários sempre disponível quando existem */}
                  {fechamento.comentarios > 0 && (
                    <CustomDropdownItem 
                      onClick={() => onViewComments?.(fechamento)}
                      className="flex items-center gap-2 text-blue-600"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Ver Comentários ({fechamento.comentarios})
                    </CustomDropdownItem>
                  )}
                </CustomDropdown>
              </div>
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
        </div>
      </CardContent>
    </Card>
  )
}