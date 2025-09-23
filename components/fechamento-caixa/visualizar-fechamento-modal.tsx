"use client"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  X,
  FileText,
  Calculator,
  MessageSquare,
  Receipt,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  Calendar,
  FileMinus,
  FileSearch,
  AlertTriangle,
  XOctagon,
  Edit3,
  Plus,
  Trash2
} from "lucide-react"
import ChatComponent, { ChatMessage } from "@/components/shared/chat-component"

export interface FechamentoData {
  id: string
  data: string
  titulo: string
  empresa: string
  responsavel: string
  status: "IN_REVIEW" | "RETURNED" | "COMPLETED" | "PENDING"
  saldoAbertura: number
  vendas: {
    boleto: number
    dinheiro: number
    cartaoDebito: number
    cartaoCredito: number
    pix: number
    transferencia: number
    outros: number
    total: number
  }
  suprimento: number
  sangrias: number
  saldoFinal: number
  observacoes: string
  tipoFinalizacao?: string
  editavelPorOperador?: boolean
  anexos: Array<{
    id: string
    name: string
    url: string
    size: number
  }>
  // Dados editados pelo operador
  dadosEditados?: {
    saldoAbertura: number
    vendas: {
      boleto: number
      dinheiro: number
      cartaoDebito: number
      cartaoCredito: number
      pix: number
      transferencia: number
      outros: number
      total: number
    }
    suprimento: number
    sangrias: number
    saldoFinal: number
    anexos: Array<{
      id: string
      name: string
      url: string
      size: number
    }>
    editadoEm: string
    editadoPor: string
  }
}


interface VisualizarFechamentoModalProps {
  isOpen: boolean
  onClose: () => void
  fechamento: FechamentoData | null
  userRole: "cliente" | "operador"
}

interface ConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText: string
  type: "warning" | "success" | "danger"
}

interface ReturnModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (motivo: string) => void
}


function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText, type }: ConfirmationModalProps) {
  const getIcon = () => {
    switch (type) {
      case "warning": return <AlertCircle className="h-5 w-5 text-orange-500" />
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />
      case "danger": return <AlertCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getButtonColor = () => {
    switch (type) {
      case "warning": return "bg-orange-600 hover:bg-orange-700"
      case "success": return "bg-green-600 hover:bg-green-700"
      case "danger": return "bg-red-600 hover:bg-red-700"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md flex flex-col p-0" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 py-3 flex-none">
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
        <div className="px-4 py-3 flex-none">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button className={getButtonColor()} onClick={onConfirm}>
              {confirmText}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReturnModal({ isOpen, onClose, onConfirm }: ReturnModalProps) {
  const [motivo, setMotivo] = useState("")

  const handleConfirm = () => {
    if (motivo.trim()) {
      onConfirm(motivo)
      setMotivo("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md flex flex-col p-0" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 py-3 flex-none">
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Retornar ao Cliente
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-4 overflow-y-auto flex-1 space-y-4">
          <div className="p-3 bg-orange-50 border border-orange-200 rounded-md">
            <p className="text-sm text-orange-800">
              <strong>Atenção:</strong> Ao retornar o fechamento, o status será alterado para "Pendência" e o cliente será notificado automaticamente sobre as correções necessárias.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do retorno *</Label>
            <Textarea
              id="motivo"
              placeholder="Descreva detalhadamente o motivo pelo qual está retornando o fechamento..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 flex-none">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-orange-600 hover:bg-orange-700"
              onClick={handleConfirm}
              disabled={!motivo.trim()}
            >
              Retornar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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

const getFinalizacaoInfo = (tipoFinalizacao?: string) => {
  if (!tipoFinalizacao) return null

  const tipos = {
    concluido_sem_divergencia: {
      icon: CheckCircle,
      className: "text-green-600",
      text: "Concluído – Sem Divergências"
    },
    concluido_sem_movimento: {
      icon: FileMinus,
      className: "text-green-600",
      text: "Concluído – Sem Movimento"
    },
    parcialmente_concluido_conferencia: {
      icon: FileSearch,
      className: "text-yellow-600",
      text: "Parcial – Conferência Parcial"
    },
    parcialmente_concluido_divergencias: {
      icon: AlertTriangle,
      className: "text-yellow-600",
      text: "Parcial – Divergências Justificadas"
    },
    quebra_caixa: {
      icon: XOctagon,
      className: "text-red-600",
      text: "Quebra de Caixa"
    },
  }

  const config = tipos[tipoFinalizacao as keyof typeof tipos]
  if (!config) return null

  const IconComponent = config.icon
  return (
    <div className="flex items-center gap-1">
      <IconComponent className={`h-4 w-4 ${config.className}`} />
      <span className={`text-xs font-medium ${config.className} hidden sm:inline`}>
        {config.text}
      </span>
    </div>
  )
}

interface FinalizeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (subtipo: string) => void
  fechamento: FechamentoData | null
}

function FinalizeModal({ isOpen, onClose, onConfirm, fechamento }: FinalizeModalProps) {
  const [subtipo, setSubtipo] = useState("")
  const [conclusao, setConclusao] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setEditedData] = useState<{
    saldoAbertura: number
    vendas: FechamentoData['vendas']
    suprimento: number
    sangrias: number
    anexos: FechamentoData['anexos']
  } | null>(null)

  const subtipos = [
    { value: "concluido_sem_divergencia", label: "Concluído – Sem Divergências" },
    { value: "concluido_sem_movimento", label: "Concluído – Sem Movimento" },
    { value: "parcialmente_concluido_conferencia", label: "Parcial – Conferência Parcial" },
    { value: "parcialmente_concluido_divergencias", label: "Parcial – Divergências Justificadas" },
    { value: "quebra_caixa", label: "Quebra de Caixa" },
  ]

  // Inicializar dados para edição
  const initializeEdit = () => {
    if (!fechamento) return
    setEditedData({
      saldoAbertura: fechamento.saldoAbertura,
      vendas: { ...fechamento.vendas },
      suprimento: fechamento.suprimento,
      sangrias: fechamento.sangrias,
      anexos: [...fechamento.anexos]
    })
    setIsEditing(true)
  }

  const cancelEdit = () => {
    setIsEditing(false)
    setEditedData(null)
  }

  const updateVendaValue = (tipo: string, value: number) => {
    if (!editedData) return
    setEditedData(prev => prev ? ({
      ...prev,
      vendas: {
        ...prev.vendas,
        [tipo]: value
      }
    }) : null)
  }

  const updateField = (field: string, value: number) => {
    if (!editedData) return
    setEditedData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null)
  }

  const handleConfirm = () => {
    if (subtipo && conclusao.trim()) {
      // Se editou, calcular dados finais e preparar para salvar
      if (editedData) {
        const totalVendas = Object.entries(editedData.vendas)
          .filter(([key]) => key !== 'total')
          .reduce((sum, [_, value]) => sum + (value as number), 0)

        const saldoFinal = editedData.saldoAbertura + totalVendas + editedData.suprimento - editedData.sangrias

        const dadosEditadosCompletos = {
          saldoAbertura: editedData.saldoAbertura,
          vendas: {
            ...editedData.vendas,
            total: totalVendas
          },
          suprimento: editedData.suprimento,
          sangrias: editedData.sangrias,
          saldoFinal: saldoFinal,
          anexos: editedData.anexos,
          editadoEm: new Date().toISOString(),
          editadoPor: "Operador Sistema" // Aqui seria o nome real do operador
        }

        console.log("Fechamento finalizado com dados editados:", { subtipo, conclusao, dadosEditados: dadosEditadosCompletos })
      } else {
        console.log("Fechamento finalizado sem edições:", { subtipo, conclusao })
      }

      onConfirm(`${subtipo}|${conclusao}`)
      setSubtipo("")
      setConclusao("")
      setIsEditing(false)
      setEditedData(null)
      onClose()
    }
  }

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(valor)
  }

  if (!fechamento) return null

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-lg flex flex-col p-0" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="px-4 py-3 flex-none">
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Finalizar Fechamento
          </DialogTitle>
        </DialogHeader>
        <div className="px-4 py-4 overflow-y-auto flex-1 space-y-4 max-h-[60vh]">
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">
              <strong>Atenção:</strong> Esta ação é irreversível. Ao finalizar, o fechamento ficará constado como finalizado no sistema.
            </p>
          </div>

          {/* Botão para ativar edição */}
          {!isEditing && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-800">Editar dados antes de finalizar</p>
                  <p className="text-xs text-green-700">Você pode editar os valores antes de confirmar a finalização</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={initializeEdit}
                  className="text-green-600 border-green-300 hover:bg-green-100"
                >
                  <Edit3 className="h-3 w-3 mr-1" />
                  Editar
                </Button>
              </div>
            </div>
          )}

          {/* Seção de edição */}
          {isEditing && (
            <Card className="border border-green-200 bg-green-50">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-green-800">
                    <Edit3 className="h-4 w-4 inline mr-1" />
                    Editando Valores
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={cancelEdit}
                    className="text-xs"
                  >
                    Cancelar Edição
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Saldo de Abertura e Suprimento */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Valores Iniciais</Label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Saldo de Abertura</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editedData?.saldoAbertura || 0}
                        onChange={(e) => {
                          const value = Math.max(0, parseFloat(e.target.value) || 0)
                          updateField('saldoAbertura', value)
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-sm h-9 font-semibold [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        placeholder="0,00"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Suprimento</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editedData?.suprimento || 0}
                        onChange={(e) => {
                          const value = Math.max(0, parseFloat(e.target.value) || 0)
                          updateField('suprimento', value)
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-sm h-9 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Vendas */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Vendas por Forma de Pagamento</Label>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Coluna 1 - Formas de Pagamento */}
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: 'boleto', label: 'Boleto' },
                        { key: 'dinheiro', label: 'Dinheiro' },
                        { key: 'cartaoDebito', label: 'Cartão Débito' },
                        { key: 'cartaoCredito', label: 'Cartão Crédito' },
                        { key: 'pix', label: 'PIX' },
                        { key: 'transferencia', label: 'Transferência' },
                        { key: 'outros', label: 'Outros' }
                      ].map(({ key, label }) => (
                        <div key={key} className="space-y-1">
                          <Label className="text-xs text-gray-600">{label}</Label>
                          <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editedData?.vendas[key as keyof typeof editedData.vendas] || 0}
                            onChange={(e) => {
                              const value = Math.max(0, parseFloat(e.target.value) || 0)
                              updateVendaValue(key, value)
                            }}
                            onWheel={(e) => e.currentTarget.blur()}
                            className="text-xs h-8 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Coluna 2 - Resumo de Vendas */}
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Resumo de Vendas</Label>
                      <div className="bg-green-50 rounded-lg p-3 space-y-1 border border-green-200">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Dinheiro + Cartões:</span>
                          <span className="font-medium">
                            {editedData && formatarMoeda(
                              (editedData.vendas.dinheiro || 0) +
                              (editedData.vendas.cartaoDebito || 0) +
                              (editedData.vendas.cartaoCredito || 0)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Total Digital:</span>
                          <span className="font-medium">
                            {editedData && formatarMoeda(
                              (editedData.vendas.pix || 0) +
                              (editedData.vendas.transferencia || 0) +
                              (editedData.vendas.boleto || 0)
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-600">Outros:</span>
                          <span className="font-medium">
                            {editedData && formatarMoeda(editedData.vendas.outros || 0)}
                          </span>
                        </div>
                        <hr className="border-green-300" />
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-green-800">Total Vendas:</span>
                          <span className="text-green-900">
                            {editedData && formatarMoeda(
                              Object.entries(editedData.vendas)
                                .filter(([key]) => key !== 'total')
                                .reduce((sum, [_, value]) => sum + value, 0)
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sangrias */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Retiradas</Label>
                  <div className="max-w-xs">
                    <div className="space-y-1">
                      <Label className="text-xs text-gray-600">Sangrias (Retiradas)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editedData?.sangrias || 0}
                        onChange={(e) => {
                          const value = Math.max(0, parseFloat(e.target.value) || 0)
                          updateField('sangrias', value)
                        }}
                        onWheel={(e) => e.currentTarget.blur()}
                        className="text-sm h-9 [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Resumo Final Completo */}
                <div className="border-t pt-3">
                  <Label className="text-sm font-medium text-gray-700 mb-2 block">Resumo Final</Label>
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Saldo de Abertura:</span>
                      <span className="font-medium">{editedData && formatarMoeda(editedData.saldoAbertura)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total de Vendas:</span>
                      <span className="font-medium text-green-600">
                        + {editedData && formatarMoeda(
                          Object.entries(editedData.vendas)
                            .filter(([key]) => key !== 'total')
                            .reduce((sum, [_, value]) => sum + value, 0)
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Suprimento:</span>
                      <span className="font-medium text-green-600">+ {editedData && formatarMoeda(editedData.suprimento)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Sangrias:</span>
                      <span className="font-medium text-red-600">- {editedData && formatarMoeda(editedData.sangrias)}</span>
                    </div>
                    <hr className="border-gray-300" />
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-800">Saldo Final:</span>
                      <span className="text-green-700">
                        {editedData && formatarMoeda(
                          editedData.saldoAbertura +
                          Object.entries(editedData.vendas)
                            .filter(([key]) => key !== 'total')
                            .reduce((sum, [_, value]) => sum + value, 0) +
                          editedData.suprimento -
                          editedData.sangrias
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-2">
            <Label htmlFor="subtipo">Tipo de finalização *</Label>
            <select
              id="subtipo"
              value={subtipo}
              onChange={(e) => setSubtipo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="">Selecione o tipo de finalização</option>
              {subtipos.map((tipo) => (
                <option key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="conclusao">Conclusão *</Label>
            <Textarea
              id="conclusao"
              placeholder="Descreva sua conclusão sobre este fechamento..."
              value={conclusao}
              onChange={(e) => setConclusao(e.target.value)}
              rows={3}
              required
            />
          </div>
        </div>
        <div className="px-4 py-3 flex-none">
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
              disabled={!subtipo || !conclusao.trim()}
            >
              Finalizar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function VisualizarFechamentoModal({
  isOpen,
  onClose,
  fechamento,
  userRole
}: VisualizarFechamentoModalProps) {
  const [activeTab, setActiveTab] = useState("detalhes")
  const [isEditing] = useState(false)
  const [showOriginal, setShowOriginal] = useState(false)
  const [tempEditData, setTempEditData] = useState<{
    vendas: FechamentoData['vendas']
    suprimento: number
    sangrias: number
    anexos: FechamentoData['anexos']
  } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [comentarios, setComentarios] = useState<ChatMessage[]>([
    {
      id: "1",
      author: "João Silva",
      role: "cliente",
      text: "Fechamento realizado conforme protocolo padrão. Todos os valores foram conferidos duas vezes.",
      timestamp: "15/01/2025 às 18:30",
      isCurrentUser: userRole === "cliente"
    },
    {
      id: "2",
      author: "Maria Santos",
      role: "operador",
      text: "Verificação inicial aprovada. Identificada pequena divergência no valor de PIX que precisa ser esclarecida.",
      timestamp: "16/01/2025 às 09:15",
      isCurrentUser: userRole === "operador"
    },
    {
      id: "3",
      author: "João Silva",
      role: "cliente",
      text: "Sobre a divergência no PIX: houve um estorno de R$ 50,00 que foi processado após o fechamento. Anexei o comprovante.",
      timestamp: "16/01/2025 às 14:22",
      isCurrentUser: userRole === "cliente",
      attachments: [
        {
          id: "att1",
          name: "comprovante-estorno-pix.pdf",
          url: "/mock/comprovante-estorno.pdf",
          size: 245760,
          type: "application/pdf"
        }
      ]
    },
    {
      id: "4",
      author: "Maria Santos",
      role: "operador",
      text: "Perfeito! Comprovante recebido e analisado. Divergência esclarecida com sucesso.",
      timestamp: "16/01/2025 às 15:30",
      isCurrentUser: userRole === "operador"
    },
    {
      id: "5",
      author: "João Silva",
      role: "cliente",
      text: "",
      timestamp: "16/01/2025 às 16:45",
      isCurrentUser: userRole === "cliente",
      attachments: [
        {
          id: "att2",
          name: "foto-sangria-noturna.jpg",
          url: "/mock/sangria.jpg",
          size: 512000,
          type: "image/jpeg"
        },
        {
          id: "att3",
          name: "relatorio-vendas.pdf",
          url: "/mock/relatorio.pdf",
          size: 1024000,
          type: "application/pdf"
        }
      ]
    }
  ])

  // Modais de confirmação
  const [showResubmitModal, setShowResubmitModal] = useState(false)
  const [showReturnModal, setShowReturnModal] = useState(false)
  const [showFinalizeModal, setShowFinalizeModal] = useState(false)

  if (!fechamento) return null

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(valor)
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      IN_REVIEW: { className: "bg-blue-100 text-blue-700", label: "Em Análise", icon: Clock },
      RETURNED: { className: "bg-orange-100 text-orange-700", label: "Pendência", icon: AlertCircle },
      COMPLETED: { className: "bg-green-100 text-green-700", label: "Finalizado", icon: CheckCircle },
      PENDING: { className: "bg-yellow-100 text-yellow-700", label: "Pendente", icon: Clock },
    }

    const config = variants[status as keyof typeof variants] || variants.PENDING
    const IconComponent = config.icon

    return (
      <Badge variant="status" className={`${config.className} gap-1`}>
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const handleSendMessage = (message: string, attachments: File[]) => {
    const fileAttachments = attachments.map(file => ({
      id: `att_${Date.now()}_${Math.random()}`,
      name: file.name,
      url: `/mock/${file.name}`,
      size: file.size,
      type: file.type
    }))

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      author: userRole === "cliente" ? fechamento.responsavel : "Operador Sistema",
      role: userRole,
      text: message,
      timestamp: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      isCurrentUser: true,
      attachments: fileAttachments.length > 0 ? fileAttachments : undefined
    }
    setComentarios([...comentarios, newMessage])
  }

  const handleResubmit = () => {
    console.log("Reenviando para análise...")
    setShowResubmitModal(false)
    onClose()
  }

  const handleReturn = (motivo: string) => {
    console.log("Retornando ao cliente com motivo:", motivo)
    // Adicionar comentário automático
    const comentarioRetorno: ChatMessage = {
      id: Date.now().toString(),
      author: "Sistema",
      role: "sistema",
      text: `Fechamento retornado ao cliente. Motivo: ${motivo}`,
      timestamp: new Date().toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    setComentarios([...comentarios, comentarioRetorno])
  }

  const handleFinalize = (subtipo: string) => {
    console.log("Finalizando com subtipo:", subtipo)
    setShowFinalizeModal(false)
    onClose()
  }


  const updateTempData = (field: 'suprimento' | 'sangrias', value: number) => {
    if (!tempEditData) return

    setTempEditData(prev => prev ? ({
      ...prev,
      [field]: value
    }) : null)
  }

  const updateVendaValue = (tipo: string, value: number) => {
    if (!tempEditData) return

    setTempEditData(prev => prev ? ({
      ...prev,
      vendas: {
        ...prev.vendas,
        [tipo]: value
      }
    }) : null)
  }

  const addAnexo = (files: FileList) => {
    if (!tempEditData || !files.length) return

    const novosAnexos = Array.from(files).map(file => ({
      id: `new_${Date.now()}_${Math.random()}`,
      name: file.name,
      url: `/mock/${file.name}`,
      size: file.size
    }))

    setTempEditData(prev => prev ? ({
      ...prev,
      anexos: [...prev.anexos, ...novosAnexos]
    }) : null)
  }

  const removeAnexo = (anexoId: string) => {
    if (!tempEditData) return

    setTempEditData(prev => prev ? ({
      ...prev,
      anexos: prev.anexos.filter((anexo: any) => anexo.id !== anexoId)
    }) : null)
  }


  // Determinar quais dados mostrar
  const getDisplayData = () => {
    // Primeiro, dados originais por padrão
    const originalData = {
      saldoAbertura: fechamento.saldoAbertura,
      vendas: fechamento.vendas,
      suprimento: fechamento.suprimento,
      sangrias: fechamento.sangrias,
      saldoFinal: fechamento.saldoFinal,
      anexos: fechamento.anexos
    }

    // Se está editando
    if (isEditing && tempEditData) {
      const totalVendas = Object.entries(tempEditData.vendas)
        .filter(([key]) => key !== 'total')
        .reduce((sum, [_, value]) => sum + (value as number), 0)

      return {
        saldoAbertura: fechamento.saldoAbertura,
        vendas: {
          ...tempEditData.vendas,
          total: totalVendas
        },
        suprimento: tempEditData.suprimento,
        sangrias: tempEditData.sangrias,
        saldoFinal: fechamento.saldoAbertura + totalVendas + tempEditData.suprimento - tempEditData.sangrias,
        anexos: tempEditData.anexos
      }
    }

    // Se deve mostrar dados originais OU não há dados editados
    if (showOriginal || !fechamento.dadosEditados) {
      return originalData
    }

    // Mostrar dados editados
    return {
      saldoAbertura: fechamento.dadosEditados.saldoAbertura,
      vendas: fechamento.dadosEditados.vendas,
      suprimento: fechamento.dadosEditados.suprimento,
      sangrias: fechamento.dadosEditados.sangrias,
      saldoFinal: fechamento.dadosEditados.saldoFinal,
      anexos: fechamento.dadosEditados.anexos
    }
  }

  const displayData = getDisplayData()

  const renderDetalhes = () => (
    <div className="space-y-6">
      {/* Toggle Original/Editado - Só aparece se houver dados editados */}
      {fechamento.dadosEditados && (
        <div className="flex items-center bg-white rounded-lg border border-gray-200 p-1 w-fit">
          <Button
            variant={showOriginal ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowOriginal(true)}
            className={`text-xs h-7 px-3 ${showOriginal ? 'bg-amber-500 text-white hover:bg-amber-600' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Original
          </Button>
          <Button
            variant={!showOriginal ? "default" : "ghost"}
            size="sm"
            onClick={() => setShowOriginal(false)}
            className={`text-xs h-7 px-3 ${!showOriginal ? 'bg-green-600 text-white hover:bg-green-700' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Editado
          </Button>
        </div>
      )}

      {/* Card de Resumo - Igual ao da Lista */}
      <Card className="border border-gray-200 bg-white">
        <CardContent className="py-4">
          <div className="flex flex-col gap-3">
            {/* Header com empresa e ícone de finalização */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base truncate">{fechamento.empresa}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {/* Ícone de finalização para fechamentos finalizados */}
                {fechamento.status === "COMPLETED" && getFinalizacaoIcon(fechamento.tipoFinalizacao)}
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
                  <span className="font-medium text-foreground">{formatarMoeda(displayData.vendas.total)}</span>
                </div>
              </div>

              {/* Segunda linha: Responsável */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-2">
                <div className="text-xs sm:text-sm text-muted-foreground truncate">
                  <span className="hidden sm:inline">Resp: </span>{fechamento.responsavel}
                </div>
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

      {/* Informações Básicas */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="h-5 w-5 text-green-600" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">Empresa</Label>
              <p className="text-sm font-semibold">{fechamento.empresa}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Responsável</Label>
              <p className="text-sm font-semibold">{fechamento.responsavel}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Título</Label>
              <p className="text-sm font-semibold">{fechamento.titulo}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">Saldo de Abertura</Label>
              <p className="text-sm font-semibold">{formatarMoeda(displayData.saldoAbertura)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendas por Forma de Pagamento */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-green-600" />
            Vendas por Forma de Pagamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'boleto', label: 'Boleto' },
              { key: 'dinheiro', label: 'Dinheiro' },
              { key: 'cartaoDebito', label: 'Cartão Débito' },
              { key: 'cartaoCredito', label: 'Cartão Crédito' },
              { key: 'pix', label: 'PIX' },
              { key: 'transferencia', label: 'Transferência' },
              { key: 'outros', label: 'Outros' }
            ].map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">{label}</Label>
                {isEditing ? (
                  <Input
                    type="number"
                    step="0.01"
                    value={tempEditData?.vendas[key as keyof typeof tempEditData.vendas] || 0}
                    onChange={(e) => updateVendaValue(key, parseFloat(e.target.value) || 0)}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm font-semibold">{formatarMoeda(displayData.vendas[key as keyof typeof displayData.vendas])}</p>
                )}
              </div>
            ))}
            <div className="space-y-2 p-3 bg-green-50 rounded border border-green-200">
              <Label className="text-sm font-medium text-green-700">Total Vendas</Label>
              <p className="text-lg font-bold text-green-800">{formatarMoeda(displayData.vendas.total)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Outras Movimentações */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-green-600" />
            Outras Movimentações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Suprimento</Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={tempEditData?.suprimento || 0}
                  onChange={(e) => updateTempData('suprimento', parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm font-semibold">{formatarMoeda(displayData.suprimento)}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Sangrias</Label>
              {isEditing ? (
                <Input
                  type="number"
                  step="0.01"
                  value={tempEditData?.sangrias || 0}
                  onChange={(e) => updateTempData('sangrias', parseFloat(e.target.value) || 0)}
                  className="text-sm"
                />
              ) : (
                <p className="text-sm font-semibold">{formatarMoeda(displayData.sangrias)}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo Final */}
      <Card className="border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5 text-green-600" />
            Resumo Final
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 rounded border-2 border-green-200 text-center">
            <Label className="text-sm font-medium text-gray-600">Saldo Final Calculado</Label>
            <p className="text-2xl font-bold text-green-700">{formatarMoeda(displayData.saldoFinal)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Observações */}
      {fechamento.observacoes && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-green-600" />
              Observações
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{fechamento.observacoes}</p>
          </CardContent>
        </Card>
      )}

      {/* Anexos */}
      {(displayData.anexos.length > 0 || isEditing) && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-600" />
                Anexos
              </div>
              {isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Adicionar
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {displayData.anexos.map((arquivo: any) => (
                <div key={arquivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{arquivo.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(arquivo.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Baixar
                    </Button>
                    {isEditing && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeAnexo(arquivo.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {displayData.anexos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm">Nenhum anexo encontrado</p>
                </div>
              )}
            </div>
            {/* Input de arquivo oculto */}
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,application/pdf"
              onChange={(e) => e.target.files && addAnexo(e.target.files)}
              className="hidden"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderComentarios = () => (
    <ChatComponent
      messages={comentarios}
      onSendMessage={handleSendMessage}
      currentUserRole={userRole}
      placeholder="Digite seu comentário..."
      allowAttachments={true}
      maxFileSize={10 * 1024 * 1024}
      acceptedFileTypes={["image/*", "application/pdf"]}
      height="h-full"
    />
  )

  const renderRodape = () => {
    if (userRole === "cliente" && fechamento.status === "RETURNED") {
      return (
        <Button
          onClick={() => setShowResubmitModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Reenviar para análise
        </Button>
      )
    }

    // Status "Em Análise" - operador pode retornar ou finalizar
    if (userRole === "operador" && fechamento.status === "IN_REVIEW") {
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowReturnModal(true)}
            className="border-orange-500 text-orange-600 hover:bg-orange-50"
          >
            Retornar ao cliente
          </Button>
          <Button
            onClick={() => setShowFinalizeModal(true)}
            className="bg-green-600 hover:bg-green-700"
          >
            Finalizar
          </Button>
        </div>
      )
    }

    // Status "Pendência" - operador só pode finalizar (já foi retornado)
    if (userRole === "operador" && fechamento.status === "RETURNED") {
      return (
        <Button
          onClick={() => setShowFinalizeModal(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          Finalizar
        </Button>
      )
    }

    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          className="
            max-sm:w-screen max-sm:h-screen max-sm:max-w-none max-sm:max-h-none max-sm:rounded-none
            sm:w-[95vw] sm:h-[90vh]
            md:w-[90vw] md:h-[85vh]
            lg:w-[90vw] lg:h-[85vh]
            xl:w-[85vw] xl:h-[80vh]
            2xl:w-[80vw] 2xl:h-[75vh]
            sm:max-w-[1100px] sm:max-h-[750px] sm:rounded-xl
            flex flex-col p-0 gap-0 border-0 shadow-2xl overflow-x-hidden
          "
          showCloseButton={false}
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
      <DialogHeader className="px-3 sm:px-6 py-2 sm:py-3 border-b bg-white shrink-0 sm:rounded-t-xl">
        <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                <DialogTitle className="text-gray-900 text-lg sm:text-xl font-semibold">
                  <span className="hidden sm:inline">Visualizar Fechamento de Caixa - {new Date(fechamento.data).toLocaleDateString('pt-BR')}</span>
                  <span className="sm:hidden">Fechamento - {new Date(fechamento.data).toLocaleDateString('pt-BR')}</span>
                </DialogTitle>
                <div className="flex items-center gap-2">
                  {getStatusBadge(fechamento.status)}
                  {fechamento.status === "COMPLETED" && getFinalizacaoInfo(fechamento.tipoFinalizacao)}
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </div>
          </DialogHeader>

          {/* Conteúdo */}
          <div className="flex-1 overflow-hidden">
            {/* Layout Desktop - Duas Colunas */}
            <div className="hidden lg:flex h-full">
              {/* Área de detalhes com scroll interno */}
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 min-w-0 overflow-x-hidden">
                  {renderDetalhes()}
                </div>
              </div>

              {/* Área de comentários com layout fixo */}
              <div className="w-1/2 border-l bg-gray-50 flex flex-col min-w-0 max-w-[50%]">
                {/* Header fixo do chat */}
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-b bg-white">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-base text-gray-800">Chat</h3>
                </div>

                {/* Container do chat - ocupa todo o espaço restante */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  {renderComentarios()}
                </div>
              </div>
            </div>

            {/* Layout Mobile - Abas */}
            <div className="lg:hidden h-full flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col h-full">
                {/* Tabs fixas no topo */}
                <div className="flex-shrink-0 bg-white border-b">
                  <TabsList className="grid w-full grid-cols-2 m-0 h-12 bg-transparent border-0 rounded-none">
                    <TabsTrigger
                      value="detalhes"
                      className="gap-1 sm:gap-2 text-xs sm:text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:text-green-600 hover:bg-gray-50"
                    >
                      <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
                      Detalhes
                    </TabsTrigger>
                    <TabsTrigger
                      value="comentarios"
                      className="gap-1 sm:gap-2 text-xs sm:text-sm h-full rounded-none border-b-2 border-transparent data-[state=active]:border-green-600 data-[state=active]:bg-transparent data-[state=active]:text-green-600 hover:bg-gray-50"
                    >
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      Chat
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Conteúdo das abas - ocupam todo o espaço restante */}
                <div className="flex-1 overflow-hidden relative">
                  <TabsContent value="detalhes" className="absolute inset-0 m-0 data-[state=inactive]:hidden">
                      <div className="h-full overflow-y-auto p-3 sm:p-4 scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 -webkit-overflow-scrolling-touch min-w-0 overflow-x-hidden">
                      {renderDetalhes()}
                    </div>
                  </TabsContent>

                  <TabsContent value="comentarios" className="absolute inset-0 m-0 flex flex-col data-[state=inactive]:hidden">
                    {/* Área do chat ocupando toda a altura */}
                    <div className="flex-1 overflow-hidden">
                      {renderComentarios()}
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Rodapé */}
          <div className="shrink-0 px-3 sm:px-6 py-2 sm:py-4 border-t bg-gray-50 sm:rounded-b-xl">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
              <Button variant="outline" onClick={onClose} className="order-2 sm:order-1 w-full sm:w-auto">
                Fechar
              </Button>
              <div className="flex gap-2 order-1 sm:order-2 w-full sm:w-auto justify-center sm:justify-end">
                {renderRodape()}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modais de Confirmação */}
      <ConfirmationModal
        isOpen={showResubmitModal}
        onClose={() => setShowResubmitModal(false)}
        onConfirm={handleResubmit}
        title="Reenviar para Análise"
        message="Tem certeza que deseja reenviar este fechamento para análise?"
        confirmText="Reenviar"
        type="success"
      />

      <ReturnModal
        isOpen={showReturnModal}
        onClose={() => setShowReturnModal(false)}
        onConfirm={handleReturn}
      />

      <FinalizeModal
        isOpen={showFinalizeModal}
        onClose={() => setShowFinalizeModal(false)}
        onConfirm={handleFinalize}
        fechamento={fechamento}
      />
    </>
  )
}