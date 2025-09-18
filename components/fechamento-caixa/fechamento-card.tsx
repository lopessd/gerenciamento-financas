"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CustomDropdown, CustomDropdownItem } from "@/components/ui/custom-dropdown"
import { useAuth } from "@/contexts/auth-context"
import { Calendar, Building2, MessageSquare, MoreVertical, Eye, RotateCcw, CheckCircle, FileMinus, AlertTriangle, FileSearch, XOctagon } from "lucide-react"

interface FechamentoData {
  id: number
  empresa: string
  data: string
  valor: string
  status: "sem_envio_aguardando" | "sem_envio_atrasado" | "em_andamento_analise" | "em_andamento_pendencia" | "finalizado_concluido"
  responsavel: string
  comentarios: number
  tipoFinalizacao?: string
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
    <div className="relative group">
      <IconComponent className={`h-4 w-4 sm:h-5 sm:w-5 ${config.className}`} />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
        {config.tooltip}
      </div>
    </div>
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
    <Card
      className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={() => onView?.(fechamento)}
    >
  <CardContent className="py-0">
        <div className="flex flex-col gap-3">
          {/* Header com empresa e menu */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <span className="font-medium text-sm sm:text-base truncate">{fechamento.empresa}</span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Ícone de finalização para fechamentos finalizados */}
              {fechamento.status === "finalizado_concluido" && getFinalizacaoIcon(fechamento.tipoFinalizacao)}
              {/* Status moved to bottom of the card for better visual alignment */}
              {/* 3 pontinhos ocultos */}
              {/* Menu de três pontos */}
              {/* <CustomDropdown
                trigger={
                  <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8">
                    <MoreVertical className="h-3 w-3 sm:h-4 sm:w-4" />
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
                {/* {user?.role === "operador" && fechamento.status === "em_andamento_analise" && (
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
                )} */}

                {/* Comentários sempre disponível quando existem */}
                {/* {fechamento.comentarios > 0 && (
                  <CustomDropdownItem
                    onClick={() => onViewComments?.(fechamento)}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Ver Comentários ({fechamento.comentarios})
                  </CustomDropdownItem>
                )} */}
              {/* </CustomDropdown> */}
            </div>
          </div>

          {/* Informações em duas linhas responsivas */}
          <div className="space-y-2">
            {/* Primeira linha: Data e Valor */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                <span>{new Date(fechamento.data).toLocaleDateString("pt-BR")}</span>
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-foreground">{fechamento.valor}</span>
              </div>
            </div>

            {/* Segunda linha: Responsável e Comentários */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                <span className="hidden sm:inline">Resp: </span>{fechamento.responsavel}
              </div>
              {fechamento.comentarios > 0 && (
                <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                  <MessageSquare className="h-3 w-3 flex-shrink-0" />
                  <span>{fechamento.comentarios}</span>
                </div>
              )}
            </div>
          </div>

          {/* Badge de status posicionado no rodapé do card */}
          <div className="mt-2">
            <div className="flex items-end justify-end">
              {getStatusBadge(fechamento.status)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
