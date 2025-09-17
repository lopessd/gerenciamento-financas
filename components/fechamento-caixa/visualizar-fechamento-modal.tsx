"use client"

import { useState, useRef, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  Clock
} from "lucide-react"
import ChatComponent, { ChatMessage } from "@/components/shared/chat-component"

interface FechamentoData {
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
  anexos: Array<{
    id: string
    name: string
    url: string
    size: number
  }>
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

interface FinalizeModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (subtipo: string) => void
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
      <DialogContent className="max-w-md" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
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
      <DialogContent className="max-w-md" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Retornar ao Cliente
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do retorno *</Label>
            <Textarea
              id="motivo"
              placeholder="Descreva o motivo pelo qual está retornando o fechamento..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              rows={4}
              required
            />
          </div>
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

function FinalizeModal({ isOpen, onClose, onConfirm }: FinalizeModalProps) {
  const [subtipo, setSubtipo] = useState("")

  const subtipos = [
    { value: "sem_divergencias", label: "Concluído sem divergências" },
    { value: "sem_movimento", label: "Sem movimento" },
    { value: "com_divergencias", label: "Com divergências justificadas" },
    { value: "conferencia_parcial", label: "Conferência parcial" },
    { value: "quebra_caixa", label: "Quebra de caixa" },
  ]

  const handleConfirm = () => {
    if (subtipo) {
      onConfirm(subtipo)
      setSubtipo("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="max-w-md" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Finalizar Fechamento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Selecione o tipo de finalização *</Label>
            <div className="space-y-2">
              {subtipos.map((tipo) => (
                <div key={tipo.value} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id={tipo.value}
                    name="subtipo"
                    value={tipo.value}
                    checked={subtipo === tipo.value}
                    onChange={(e) => setSubtipo(e.target.value)}
                    className="h-4 w-4 text-green-600"
                  />
                  <Label htmlFor={tipo.value} className="text-sm font-normal cursor-pointer">
                    {tipo.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={handleConfirm}
              disabled={!subtipo}
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
      IN_REVIEW: { className: "bg-orange-100 text-orange-700", label: "Em Análise", icon: Clock },
      RETURNED: { className: "bg-red-100 text-red-700", label: "Retornado", icon: AlertCircle },
      COMPLETED: { className: "bg-green-100 text-green-700", label: "Concluído", icon: CheckCircle },
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

  const renderDetalhes = () => (
    <div className="space-y-6">
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
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.saldoAbertura)}</p>
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
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Boleto</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.boleto)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Dinheiro</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.dinheiro)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Cartão Débito</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.cartaoDebito)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Cartão Crédito</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.cartaoCredito)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">PIX</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.pix)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Transferência</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.transferencia)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Outros</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.vendas.outros)}</p>
            </div>
            <div className="space-y-2 p-3 bg-green-50 rounded border border-green-200">
              <Label className="text-sm font-medium text-green-700">Total Vendas</Label>
              <p className="text-lg font-bold text-green-800">{formatarMoeda(fechamento.vendas.total)}</p>
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
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.suprimento)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Sangrias</Label>
              <p className="text-sm font-semibold">{formatarMoeda(fechamento.sangrias)}</p>
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
            <p className="text-2xl font-bold text-green-700">{formatarMoeda(fechamento.saldoFinal)}</p>
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
      {fechamento.anexos.length > 0 && (
        <Card className="border border-gray-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-green-600" />
              Anexos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {fechamento.anexos.map((arquivo) => (
                <div key={arquivo.id} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{arquivo.name}</span>
                    <span className="text-xs text-gray-500">
                      ({(arquivo.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                  <Button variant="outline" size="sm">
                    Baixar
                  </Button>
                </div>
              ))}
            </div>
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

    return null
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent
          className="w-[98vw] sm:w-[95vw] md:w-[90vw] lg:w-[90vw] xl:w-[85vw] 2xl:w-[80vw] max-w-[1100px] h-[90vh] sm:h-[85vh] max-h-[750px] flex flex-col p-0 gap-0 !rounded-xl !border-0 shadow-2xl"
          showCloseButton={false}
          onPointerDownOutside={(e) => e.preventDefault()}
          style={{
            width: "min(98vw, 1100px)",
            maxWidth: "1100px",
            height: "min(90vh, 750px)",
            maxHeight: "750px"
          }}
        >
      <DialogHeader className="px-3 sm:px-6 py-2 sm:py-3 border-b bg-gradient-to-r from-green-600 to-green-700 shrink-0 rounded-t-xl">
        <div className="flex items-center justify-between gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 min-w-0">
                <DialogTitle className="text-white text-lg sm:text-xl font-semibold">
                  <span className="hidden sm:inline">Visualizar Fechamento de Caixa - {new Date(fechamento.data).toLocaleDateString('pt-BR')}</span>
                  <span className="sm:hidden">Fechamento - {new Date(fechamento.data).toLocaleDateString('pt-BR')}</span>
                </DialogTitle>
                {getStatusBadge(fechamento.status)}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 transition-colors flex-shrink-0"
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
              <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-6">
                  {renderDetalhes()}
                </div>
              </div>
              
              {/* Área de comentários com layout fixo */}
              <div className="flex-1 border-l bg-gray-50 flex flex-col min-w-0 max-w-[50%]">
                {/* Header fixo do chat (mais fino) */}
                <div className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-b bg-white">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <h3 className="font-semibold text-base pl-1">Chat</h3>
                </div>
                
                {/* Container do chat com altura definida */}
                <div className="flex-1 flex flex-col min-h-[400px] max-h-full overflow-hidden">
                  {renderComentarios()}
                </div>
              </div>
            </div>

            {/* Layout Mobile - Abas */}
            <div className="lg:hidden h-full flex flex-col">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                {/* Tabs fixas no topo */}
                <div className="flex-shrink-0">
                  <TabsList className="grid w-full grid-cols-2 mx-2 sm:mx-4 mb-0">
                    <TabsTrigger value="detalhes" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Receipt className="h-3 w-3 sm:h-4 sm:w-4" />
                      Detalhes
                    </TabsTrigger>
                    <TabsTrigger value="comentarios" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                      Chat
                    </TabsTrigger>
                  </TabsList>
                </div>

                {/* Conteúdo das abas com altura fixa */}
                <div className="flex-1 min-h-[400px] overflow-hidden">
                  <TabsContent value="detalhes" className="h-full overflow-y-auto p-2 sm:p-4 m-0">
                    {renderDetalhes()}
                  </TabsContent>

                  <TabsContent value="comentarios" className="h-full m-0 flex flex-col">
                    {renderComentarios()}
                  </TabsContent>
                </div>
              </Tabs>
            </div>
          </div>

          {/* Rodapé */}
          <div className="shrink-0 px-3 sm:px-6 py-3 sm:py-4 border-t bg-gray-50 rounded-b-xl">
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
      />
    </>
  )
}