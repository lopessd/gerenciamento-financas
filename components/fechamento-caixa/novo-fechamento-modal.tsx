"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, AlertCircle, Calculator, FileText } from "lucide-react"

interface NovoFechamentoModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (dados: FechamentoDados) => void
}

interface FechamentoDados {
  data: string
  titulo: string
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
  saldoFinalCaixa: number
  observacoes: string
  anexos: File[]
}

interface ConfirmacaoCancelamentoProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

function ConfirmacaoCancelamento({ isOpen, onConfirm, onCancel }: ConfirmacaoCancelamentoProps) {
    return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent noBorder className="max-w-md w-[90vw] p-4 sm:p-6 rounded-lg overflow-hidden" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-orange-600 text-base sm:text-lg">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Confirmar Cancelamento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja cancelar? Todos os dados inseridos serão perdidos.
          </p>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancel} size="sm">
              Continuar Editando
            </Button>
            <Button type="button" variant="destructive" onClick={onConfirm} size="sm">
              Sim, Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface ConfirmacaoEnvioProps {
  isOpen: boolean
  onConfirmar: () => void
  onCancelar: () => void
}

interface DivergenciaCaixaProps {
  isOpen: boolean
  esperado: number
  informado: number
  onContinuar: () => void
  onVoltar: () => void
  formatarMoeda: (valor: number) => string
}

function ConfirmacaoEnvio({ isOpen, onConfirmar, onCancelar }: ConfirmacaoEnvioProps) {
  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent noBorder className="max-w-md w-[90vw] p-4 sm:p-6 rounded-lg overflow-hidden" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-orange-600 text-base sm:text-lg">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Confirmar Envio
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tem certeza que deseja enviar este fechamento de caixa? Após o envio, não será possível editá-lo.
          </p>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onCancelar} size="sm">
              Cancelar
            </Button>
            <Button type="button" variant="default" onClick={onConfirmar} size="sm" className="bg-green-600 hover:bg-green-700">
              Confirmar Envio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function DivergenciaCaixa({ isOpen, esperado, informado, onContinuar, onVoltar, formatarMoeda }: DivergenciaCaixaProps) {
  const diferenca = informado - esperado
  const isDiferencaPositiva = diferenca > 0

  return (
    <Dialog open={isOpen} onOpenChange={onVoltar}>
      <DialogContent noBorder className="max-w-md w-[90vw] p-4 sm:p-6 rounded-lg overflow-hidden" showCloseButton={true} onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-red-600 text-base sm:text-lg">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Divergência no Caixa
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Foi detectada uma divergência entre o valor esperado e o valor informado do caixa:
          </p>

          <div className="space-y-3 bg-gray-50 p-4 rounded">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Valor Esperado:</span>
              <span className="text-sm font-bold text-green-600">{formatarMoeda(esperado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm font-medium">Valor Informado:</span>
              <span className="text-sm font-bold text-gray-700">{formatarMoeda(informado)}</span>
            </div>
            <hr className="border-gray-300" />
            <div className="flex justify-between">
              <span className="text-sm font-medium">Diferença:</span>
              <span className={`text-sm font-bold ${isDiferencaPositiva ? 'text-green-600' : 'text-red-600'}`}>
                {isDiferencaPositiva ? '+' : ''}{formatarMoeda(diferenca)}
              </span>
            </div>
          </div>

          <p className="text-xs text-gray-500">
            Esta divergência será registrada para análise.
          </p>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={onVoltar} size="sm">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function NovoFechamentoModal({ isOpen, onClose, onSave }: NovoFechamentoModalProps) {
  const [dados, setDados] = useState<FechamentoDados>({
    data: new Date().toISOString().split('T')[0],
    titulo: '',
    saldoAbertura: 0,
    vendas: {
      boleto: 0,
      dinheiro: 0,
      cartaoDebito: 0,
      cartaoCredito: 0,
      pix: 0,
      transferencia: 0,
      outros: 0,
      total: 0
    },
    suprimento: 0,
    sangrias: 0,
    saldoFinalCaixa: 0,
    observacoes: '',
    anexos: []
  })

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [mostrarConfirmacaoEnvio, setMostrarConfirmacaoEnvio] = useState(false)
  const [temAlteracoes, setTemAlteracoes] = useState(false)
  const [erroValidacao, setErroValidacao] = useState<string>('')
  const [mostrarDivergencia, setMostrarDivergencia] = useState(false)
  const [divergenciaInfo, setDivergenciaInfo] = useState<{esperado: number, informado: number}>({esperado: 0, informado: 0})
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const total = Object.values(dados.vendas).reduce((acc, val) => {
      if (typeof val === 'number') return acc + val
      return acc
    }, 0) - dados.vendas.total

    setDados(prev => ({
      ...prev,
      vendas: { ...prev.vendas, total }
    }))
  }, [dados.vendas.boleto, dados.vendas.dinheiro, dados.vendas.cartaoDebito, dados.vendas.cartaoCredito, dados.vendas.pix, dados.vendas.transferencia, dados.vendas.outros])

  useEffect(() => {
    const hasChanges = dados.titulo !== '' ||
                      dados.saldoAbertura !== 0 ||
                      Object.values(dados.vendas).some(v => typeof v === 'number' && v !== 0) ||
                      dados.suprimento !== 0 ||
                      dados.sangrias !== 0 ||
                      dados.saldoFinalCaixa !== 0 ||
                      dados.observacoes !== '' ||
                      dados.anexos.length > 0
    setTemAlteracoes(hasChanges)
  }, [dados])

  const formatarMoeda = (valor: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    }).format(valor)
  }

  const formatarMoedaCompacta = (valor: number): string => {
    if (Math.abs(valor) >= 1000000) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
        notation: 'compact',
        maximumFractionDigits: 1
      }).format(valor)
    }
    return formatarMoeda(valor)
  }

  const parseMoeda = (valor: string): number => {
    const numericValue = valor.replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(numericValue) || 0
  }

  const calcularSaldoEsperado = (): number => {
    return dados.saldoAbertura + dados.suprimento + dados.vendas.dinheiro - dados.sangrias
  }

  const handleInputChange = (campo: keyof FechamentoDados, valor: any) => {
    setDados(prev => ({ ...prev, [campo]: valor }))
  }

  const handleNumericChange = (campo: keyof FechamentoDados, valorString: string) => {
    // Permitir string vazia para poder deletar
    if (valorString === '') {
      setDados(prev => ({ ...prev, [campo]: 0 }))
      return
    }

    const valor = parseFloat(valorString)
    // Bloquear valores inválidos ou negativos, mas permitir zero
    if (isNaN(valor) || valor < 0) {
      return
    }

    setDados(prev => ({ ...prev, [campo]: valor }))
  }

  const handleVendasChange = (tipo: keyof typeof dados.vendas, valorString: string) => {
    if (tipo === 'total') return

    // Permitir string vazia para poder deletar
    if (valorString === '') {
      setDados(prev => ({
        ...prev,
        vendas: { ...prev.vendas, [tipo]: 0 }
      }))
      return
    }

    const valor = parseFloat(valorString)
    // Bloquear valores inválidos ou negativos, mas permitir zero
    if (isNaN(valor) || valor < 0) {
      return
    }

    setDados(prev => ({
      ...prev,
      vendas: { ...prev.vendas, [tipo]: valor }
    }))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'image/webp']
      const maxSize = 5 * 1024 * 1024 // 5MB
      return validTypes.includes(file.type) && file.size <= maxSize
    })

    setDados(prev => ({
      ...prev,
      anexos: [...prev.anexos, ...validFiles]
    }))

    // Limpar erro de validação se anexo foi adicionado
    if (validFiles.length > 0 && erroValidacao) {
      setErroValidacao('')
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removerAnexo = (index: number) => {
    setDados(prev => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index)
    }))
  }

  const handleFechar = () => {
    if (temAlteracoes) {
      setMostrarConfirmacao(true)
    } else {
      onClose()
    }
  }

  const confirmarCancelamento = () => {
    setMostrarConfirmacao(false)
    onClose()
  }

  const validarCampos = (): boolean => {
    setErroValidacao('')

    // Validar campos obrigatórios
    if (!dados.titulo.trim()) {
      setErroValidacao('O título/descrição é obrigatório.')
      return false
    }

    if (!dados.data) {
      setErroValidacao('A data do fechamento é obrigatória.')
      return false
    }

    if (isNaN(dados.saldoAbertura) || dados.saldoAbertura < 0) {
      setErroValidacao('O saldo inicial deve ser um valor válido maior ou igual a zero.')
      return false
    }

    if (isNaN(dados.suprimento) || dados.suprimento < 0) {
      setErroValidacao('O valor de suprimentos deve ser um valor válido maior ou igual a zero.')
      return false
    }

    if (isNaN(dados.sangrias) || dados.sangrias < 0) {
      setErroValidacao('O valor de sangrias deve ser um valor válido maior ou igual a zero.')
      return false
    }

    if (isNaN(dados.saldoFinalCaixa) || dados.saldoFinalCaixa < 0) {
      setErroValidacao('O saldo final do caixa deve ser um valor válido maior ou igual a zero.')
      return false
    }

    // Validar se todas as vendas são válidas (>= 0)
    const vendasInvalidas = Object.entries(dados.vendas).filter(([key, valor]) => {
      if (key === 'total') return false // Pular o total que é calculado
      return typeof valor === 'number' && (isNaN(valor) || valor < 0)
    })

    if (vendasInvalidas.length > 0) {
      setErroValidacao('Todos os valores de vendas devem ser valores válidos maiores ou iguais a zero.')
      return false
    }

    // Validar se existe sangria e se há anexo obrigatório
    if (dados.sangrias > 0 && dados.anexos.length === 0) {
      setErroValidacao('É obrigatório anexar um comprovante quando houver sangria.')
      return false
    }

    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validarCampos()) {
      return
    }

    // Mostrar popup de confirmação de envio
    setMostrarConfirmacaoEnvio(true)
  }

  const confirmarEnvio = () => {
    setMostrarConfirmacaoEnvio(false)

    // Verificar divergência no saldo do caixa
    const saldoEsperado = calcularSaldoEsperado()
    const diferencaAbsoluta = Math.abs(saldoEsperado - dados.saldoFinalCaixa)

    if (diferencaAbsoluta > 0.01) { // Tolerância de 1 centavo para arredondamentos
      setDivergenciaInfo({
        esperado: saldoEsperado,
        informado: dados.saldoFinalCaixa
      })
      setMostrarDivergencia(true)
      return
    }

    // Se não há divergência, finalizar envio
    finalizarEnvio()
  }

  const finalizarEnvio = () => {
    if (onSave) {
      onSave(dados)
    }
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent noBorder className="max-w-6xl w-[95vw] max-h-[95vh] flex flex-col p-0 gap-0 !rounded-xl overflow-hidden" showCloseButton={false} onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader className="px-6 py-4 border-b bg-gradient-to-r from-green-600 to-green-700 shrink-0 rounded-t-xl">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-white text-xl font-semibold">
                Novo Fechamento de Caixa
              </DialogTitle>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleFechar}
                className="text-white hover:bg-white/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto">
            <form id="fechamento-form" onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="titulo" className="text-sm font-medium">
                    Título/Descrição *
                  </Label>
                  <Input
                    id="titulo"
                    type="text"
                    placeholder="Ex: Fechamento Diário - Loja Principal"
                    value={dados.titulo}
                    onChange={(e) => handleInputChange('titulo', e.target.value)}
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data" className="text-sm font-medium">
                    Data do Fechamento *
                  </Label>
                  <Input
                    id="data"
                    type="date"
                    value={dados.data}
                    onChange={(e) => handleInputChange('data', e.target.value)}
                    className="w-full"
                    required
                  />
                </div>
              </div>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Saldo de Abertura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="saldoAbertura" className="text-sm font-medium">
                        Saldo Inicial *
                      </Label>
                      <Input
                        id="saldoAbertura"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.saldoAbertura.toString()}
                        onChange={(e) => handleNumericChange('saldoAbertura', e.target.value)}
                        className="w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="suprimento" className="text-sm font-medium">
                        Suprimentos *
                      </Label>
                      <Input
                        id="suprimento"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.suprimento.toString()}
                        onChange={(e) => handleNumericChange('suprimento', e.target.value)}
                        className="w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Vendas por Forma de Pagamento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="dinheiro" className="text-sm font-medium">
                        Dinheiro *
                      </Label>
                      <Input
                        id="dinheiro"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.dinheiro.toString()}
                        onChange={(e) => handleVendasChange('dinheiro', e.target.value)}
                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cartaoDebito" className="text-sm font-medium">
                        Cartão Débito *
                      </Label>
                      <Input
                        id="cartaoDebito"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.cartaoDebito.toString()}
                        onChange={(e) => handleVendasChange('cartaoDebito', e.target.value)}
                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cartaoCredito" className="text-sm font-medium">
                        Cartão Crédito *
                      </Label>
                      <Input
                        id="cartaoCredito"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.cartaoCredito.toString()}
                        onChange={(e) => handleVendasChange('cartaoCredito', e.target.value)}
                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pix" className="text-sm font-medium">
                        PIX *
                      </Label>
                      <Input
                        id="pix"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.pix.toString()}
                        onChange={(e) => handleVendasChange('pix', e.target.value)}
                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="boleto" className="text-sm font-medium">
                        Boleto *
                      </Label>
                      <Input
                        id="boleto"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.boleto.toString()}
                        onChange={(e) => handleVendasChange('boleto', e.target.value)}
                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outros" className="text-sm font-medium">
                        Outros *
                      </Label>
                      <Input
                        id="outros"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.outros.toString()}
                        onChange={(e) => handleVendasChange('outros', e.target.value)}
                        className="[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                        onWheel={(e) => e.currentTarget.blur()}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-green-600">
                        Total Vendas
                      </Label>
                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-semibold text-center" title={formatarMoeda(dados.vendas.total)}>
                        {formatarMoedaCompacta(dados.vendas.total)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Retiradas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="sangrias" className="text-sm font-medium">
                      Sangrias *
                      {dados.sangrias > 0 && (
                        <span className="text-red-500 ml-1">(anexo obrigatório)</span>
                      )}
                    </Label>
                    <Input
                      id="sangrias"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={dados.sangrias.toString()}
                      onChange={(e) => handleNumericChange('sangrias', e.target.value)}
                      className="w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      onWheel={(e) => e.currentTarget.blur()}
                      required
                    />
                    {dados.sangrias > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        * Anexo obrigatório para sangrias
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Saldo Final do Caixa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="saldoFinalCaixa" className="text-sm font-medium">
                      Valor do Caixa Físico *
                    </Label>
                    <Input
                      id="saldoFinalCaixa"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={dados.saldoFinalCaixa.toString()}
                      onChange={(e) => handleNumericChange('saldoFinalCaixa', e.target.value)}
                      className="w-full [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                      onWheel={(e) => e.currentTarget.blur()}
                      required
                    />
                    <p className="text-xs text-gray-500">
                      Informe o valor físico encontrado no caixa para conferência
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Label htmlFor="observacoes" className="text-sm font-medium">
                  Observações
                </Label>
                <Textarea
                  id="observacoes"
                  placeholder="Digite observações sobre o fechamento..."
                  value={dados.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Card className={`border ${dados.sangrias > 0 && dados.anexos.length === 0 ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className={`h-5 w-5 ${dados.sangrias > 0 ? 'text-red-600' : 'text-green-600'}`} />
                    Anexos
                    {dados.sangrias > 0 && (
                      <span className="text-red-500 text-base">*</span>
                    )}
                  </CardTitle>
                  {dados.sangrias > 0 && (
                    <p className="text-sm text-red-600 mt-2">
                      Anexo obrigatório devido à sangria de {formatarMoeda(dados.sangrias)}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`border-2 border-dashed rounded p-6 text-center transition-colors ${
                      dados.sangrias > 0 && dados.anexos.length === 0
                        ? 'border-red-300 bg-red-50 hover:border-red-400'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}>
                      <Upload className={`h-8 w-8 mx-auto mb-2 ${
                        dados.sangrias > 0 && dados.anexos.length === 0 ? 'text-red-400' : 'text-gray-400'
                      }`} />
                      <p className={`text-sm mb-2 ${
                        dados.sangrias > 0 && dados.anexos.length === 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {dados.sangrias > 0 ? 'Anexar comprovante obrigatório (imagens ou PDF)' : 'Anexar comprovantes (imagens ou PDF)'}
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        Máximo 5MB por arquivo
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*,application/pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant={dados.sangrias > 0 && dados.anexos.length === 0 ? "destructive" : "outline"}
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        {dados.sangrias > 0 && dados.anexos.length === 0 ? 'Selecionar Comprovante Obrigatório' : 'Selecionar Arquivos'}
                      </Button>
                    </div>

                    {dados.anexos.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-700">Arquivos anexados:</p>
                        <div className="space-y-2">
                          {dados.anexos.map((arquivo, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-700 truncate max-w-[200px]">
                                  {arquivo.name}
                                </span>
                                <span className="text-xs text-gray-500">
                                  ({(arquivo.size / 1024).toFixed(1)} KB)
                                </span>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removerAnexo(index)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </form>
          </div>

          <div className="shrink-0 p-6 border-t bg-gray-50 rounded-b-xl">
            {erroValidacao && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <span className="text-sm text-red-700">{erroValidacao}</span>
              </div>
            )}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={handleFechar}>
                Cancelar
              </Button>
              <Button type="submit" form="fechamento-form" className="bg-green-600 hover:bg-green-700">
                Enviar Fechamento
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmacaoCancelamento
        isOpen={mostrarConfirmacao}
        onConfirm={confirmarCancelamento}
        onCancel={() => setMostrarConfirmacao(false)}
      />

      <ConfirmacaoEnvio
        isOpen={mostrarConfirmacaoEnvio}
        onConfirmar={confirmarEnvio}
        onCancelar={() => setMostrarConfirmacaoEnvio(false)}
      />

      <DivergenciaCaixa
        isOpen={mostrarDivergencia}
        esperado={divergenciaInfo.esperado}
        informado={divergenciaInfo.informado}
        onContinuar={() => {
          setMostrarDivergencia(false)
          finalizarEnvio()
        }}
        onVoltar={() => {
          setMostrarDivergencia(false)
          finalizarEnvio() // Finalizar envio mesmo com divergência quando fechar
        }}
        formatarMoeda={formatarMoeda}
      />
    </>
  )
}
