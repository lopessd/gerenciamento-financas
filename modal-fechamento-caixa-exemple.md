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
  saldoFinal: number
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-md w-[90vw] p-4 sm:p-6" showCloseButton={false}>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="absolute top-3 right-3 z-20 text-muted-foreground hover:text-muted-foreground/80"
          aria-label="Fechar"
        >
          <X className="h-4 w-4" />
        </Button>
        <DialogHeader className="pb-3">
          <DialogTitle className="flex items-center gap-2 text-orange-600 text-base sm:text-lg">
            <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
            Confirmar Cancelamento
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Tem certeza que deseja cancelar o fechamento de caixa? Todos os dados preenchidos serão perdidos.
          </p>
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <Button variant="outline" onClick={onCancel} className="text-sm py-2">
              Continuar Editando
            </Button>
            <Button variant="destructive" onClick={onConfirm} className="text-sm py-2">
              Sim, Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function NovoFechamentoModal({ isOpen, onClose, onSave }: NovoFechamentoModalProps) {
  const [showConfirmacao, setShowConfirmacao] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Data atual formatada para input date
  const dataAtual = new Date().toISOString().split('T')[0]
  
  const [formData, setFormData] = useState<FechamentoDados>({
    data: dataAtual,
    titulo: "",
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
    saldoFinal: 0,
    observacoes: "",
    anexos: []
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Calcular total de vendas automaticamente
  useEffect(() => {
    const totalVendas = 
      formData.vendas.boleto +
      formData.vendas.dinheiro +
      formData.vendas.cartaoDebito +
      formData.vendas.cartaoCredito +
      formData.vendas.pix +
      formData.vendas.transferencia +
      formData.vendas.outros

    setFormData(prev => ({
      ...prev,
      vendas: {
        ...prev.vendas,
        total: totalVendas
      }
    }))
  }, [
    formData.vendas.boleto,
    formData.vendas.dinheiro,
    formData.vendas.cartaoDebito,
    formData.vendas.cartaoCredito,
    formData.vendas.pix,
    formData.vendas.transferencia,
    formData.vendas.outros
  ])

  // Calcular saldo final automaticamente
  useEffect(() => {
    const saldoFinal = (formData.saldoAbertura + formData.vendas.total + formData.suprimento) - formData.sangrias
    setFormData(prev => ({
      ...prev,
      saldoFinal
    }))
  }, [formData.saldoAbertura, formData.vendas.total, formData.suprimento, formData.sangrias])

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const handleNumberChange = (field: string, value: string, subField?: string) => {
    // Remove tudo que não for número ou vírgula/ponto
    const numericValue = value.replace(/[^\d,.-]/g, '').replace(',', '.')
    const floatValue = parseFloat(numericValue) || 0

    // Atualiza campos dentro de 'vendas'
    if (field === 'vendas' && subField) {
      setFormData(prev => ({
        ...prev,
        vendas: {
          ...prev.vendas,
          [subField]: floatValue
        }
      }))
      
    // Campos numéricos do topo do formulário
    } else if (field === 'saldoAbertura' || field === 'suprimento' || field === 'sangrias' || field === 'saldoFinal') {
      // usar cast seguro para chave tipada
      setFormData(prev => ({
        ...prev,
        [field as keyof FechamentoDados]: floatValue as any
      }))
    } else {
      // Campo desconhecido — ignorar (proteção)
      return
    }

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setFormData(prev => ({
      ...prev,
      anexos: [...prev.anexos, ...files]
    }))
  }

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      anexos: prev.anexos.filter((_, i) => i !== index)
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.data) {
      newErrors.data = 'Data é obrigatória'
    }

    if (!formData.titulo.trim()) {
      newErrors.titulo = 'Título é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    onSave?.(formData)
    onClose()
  }

  const handleCancel = () => {
    setShowConfirmacao(true)
  }

  const confirmCancel = () => {
    setShowConfirmacao(false)
    onClose()
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleCancel()} data-testid="fechamento-modal">
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto w-[95vw] sm:w-full p-3 sm:p-6" showCloseButton={false}>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleCancel}
            className="absolute top-3 right-3 z-20 text-muted-foreground hover:text-muted-foreground/80"
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
          <DialogHeader className="pb-3 sm:pb-6">
            <DialogTitle className="text-lg sm:text-xl font-bold">Fechamento de Caixa</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            {/* Cabeçalho - Data e Título */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                  Dados Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="data" className="text-xs sm:text-sm font-medium">
                      Data do Fechamento *
                    </Label>
                    <Input
                      id="data"
                      type="date"
                      value={formData.data}
                      onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                      className={text-sm ${errors.data ? 'border-red-500' : ''}}
                      aria-describedby={errors.data ? 'data-error' : undefined}
                    />
                    {errors.data && (
                      <p id="data-error" className="text-xs sm:text-sm text-red-600">{errors.data}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="titulo" className="text-xs sm:text-sm font-medium">
                      Título do Fechamento *
                    </Label>
                    <Input
                      id="titulo"
                      type="text"
                      placeholder="Ex: Fechamento Diário - Loja Centro"
                      value={formData.titulo}
                      onChange={(e) => setFormData(prev => ({ ...prev, titulo: e.target.value }))}
                      className={text-sm ${errors.titulo ? 'border-red-500' : ''}}
                      aria-describedby={errors.titulo ? 'titulo-error' : undefined}
                    />
                    {errors.titulo && (
                      <p id="titulo-error" className="text-xs sm:text-sm text-red-600">{errors.titulo}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saldo de Abertura */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                  Saldo de Abertura
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="saldoAbertura" className="text-xs sm:text-sm font-medium">
                    Saldo de Abertura (Suprimento)
                  </Label>
                  <Input
                    id="saldoAbertura"
                    type="text"
                    placeholder="0,00"
                    value={formData.saldoAbertura === 0 ? '' : formData.saldoAbertura.toString()}
                    onChange={(e) => handleNumberChange('saldoAbertura', e.target.value)}
                    className="text-right text-sm"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vendas */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Vendas por Forma de Pagamento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="boleto" className="text-xs sm:text-sm font-medium">Total de Vendas - Boleto</Label>
                    <Input
                      id="boleto"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.boleto === 0 ? '' : formData.vendas.boleto.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'boleto')}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="dinheiro" className="text-xs sm:text-sm font-medium">Total de Vendas - Dinheiro</Label>
                    <Input
                      id="dinheiro"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.dinheiro === 0 ? '' : formData.vendas.dinheiro.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'dinheiro')}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="cartaoDebito" className="text-xs sm:text-sm font-medium">Total de Vendas - Cartão Débito</Label>
                    <Input
                      id="cartaoDebito"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.cartaoDebito === 0 ? '' : formData.vendas.cartaoDebito.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'cartaoDebito')}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="cartaoCredito" className="text-xs sm:text-sm font-medium">Total de Vendas - Cartão Crédito</Label>
                    <Input
                      id="cartaoCredito"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.cartaoCredito === 0 ? '' : formData.vendas.cartaoCredito.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'cartaoCredito')}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="pix" className="text-xs sm:text-sm font-medium">Total de Vendas - PIX</Label>
                    <Input
                      id="pix"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.pix === 0 ? '' : formData.vendas.pix.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'pix')}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="transferencia" className="text-xs sm:text-sm font-medium">Total de Vendas - Transferência Bancária</Label>
                    <Input
                      id="transferencia"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.transferencia === 0 ? '' : formData.vendas.transferencia.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'transferencia')}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="outros" className="text-xs sm:text-sm font-medium">Total de Vendas - Outros</Label>
                    <Input
                      id="outros"
                      type="text"
                      placeholder="0,00"
                      value={formData.vendas.outros === 0 ? '' : formData.vendas.outros.toString()}
                      onChange={(e) => handleNumberChange('vendas', e.target.value, 'outros')}
                      className="text-right text-sm"
                    />
                  </div>
                </div>

                {/* Total de Vendas - Calculado */}
                <div className="border-t pt-3 sm:pt-4">
                  <div className="bg-blue-50 p-3 sm:p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-base font-semibold text-blue-800">Total de Vendas:</span>
                      <span className="text-lg sm:text-xl font-bold text-blue-800">
                        {formatarMoeda(formData.vendas.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Outras Movimentações */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Outras Movimentações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="suprimento" className="text-xs sm:text-sm font-medium">
                      Suprimento
                      <span className="text-xs text-muted-foreground ml-1">(entradas adicionais)</span>
                    </Label>
                    <Input
                      id="suprimento"
                      type="text"
                      placeholder="0,00"
                      value={formData.suprimento === 0 ? '' : formData.suprimento.toString()}
                      onChange={(e) => handleNumberChange('suprimento', e.target.value)}
                      className="text-right text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="sangrias" className="text-xs sm:text-sm font-medium">
                      Sangrias
                      <span className="text-xs text-muted-foreground ml-1">(retiradas do caixa)</span>
                    </Label>
                    <Input
                      id="sangrias"
                      type="text"
                      placeholder="0,00"
                      value={formData.sangrias === 0 ? '' : formData.sangrias.toString()}
                      onChange={(e) => handleNumberChange('sangrias', e.target.value)}
                      className="text-right text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Saldo Final */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                  Saldo Final Calculado
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="bg-green-50 p-3 sm:p-6 rounded-lg space-y-2 sm:space-y-3">
                  <div className="text-xs sm:text-sm text-muted-foreground space-y-1">
                    <div className="flex justify-between">
                      <span>Saldo de Abertura:</span>
                      <span>{formatarMoeda(formData.saldoAbertura)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total de Vendas:</span>
                      <span>{formatarMoeda(formData.vendas.total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Suprimentos:</span>
                      <span>{formatarMoeda(formData.suprimento)}</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Sangrias:</span>
                      <span>- {formatarMoeda(formData.sangrias)}</span>
                    </div>
                  </div>
                  <div className="border-t pt-2 sm:pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm sm:text-lg font-semibold text-green-800">Saldo Final do Caixa:</span>
                      <span className={text-lg sm:text-2xl font-bold ${formData.saldoFinal < 0 ? 'text-red-700' : 'text-green-800'}}>
                        {formatarMoeda(formData.saldoFinal)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Observações e Anexos */}
            <Card>
              <CardHeader className="pb-3 sm:pb-6">
                <CardTitle className="text-base sm:text-lg">Observações e Anexos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="observacoes" className="text-xs sm:text-sm font-medium">Observações</Label>
                  <Textarea
                    id="observacoes"
                    placeholder="Digite observações sobre o fechamento..."
                    value={formData.observacoes}
                    onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                    rows={3}
                    className="resize-none text-sm"
                  />
                </div>

                {/* Upload de Arquivos */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label className="text-xs sm:text-sm font-medium">Anexar Arquivos</Label>
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 sm:p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-1 sm:mb-2" />
                    <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">
                      Clique aqui para anexar comprovantes
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG até 10MB cada
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Lista de arquivos anexados */}
                  {formData.anexos.length > 0 && (
                    <div className="space-y-1.5 sm:space-y-2">
                      <p className="text-xs sm:text-sm font-medium">Arquivos Anexados:</p>
                      <div className="space-y-1">
                        {formData.anexos.map((file, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded text-xs sm:text-sm">
                            <span className="truncate flex-1 min-w-0 pr-2">{file.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="h-6 w-6 p-0 text-red-500 hover:text-red-700 flex-shrink-0"
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aviso e Botões */}
            <div className="space-y-3 sm:space-y-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs sm:text-sm text-orange-800">
                    <strong>Atenção:</strong> Este fechamento de caixa não pode ser editado após o envio.
                    Revise cuidadosamente todos os dados antes de confirmar.
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  className="sm:order-1 text-sm py-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white sm:order-2 text-sm py-2"
                  disabled={!formData.data || !formData.titulo.trim()}
                >
                  Criar Fechamento de Caixa
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Cancelamento */}
      <ConfirmacaoCancelamento
        isOpen={showConfirmacao}
        onConfirm={confirmCancel}
        onCancel={() => setShowConfirmacao(false)}
      />
    </>
  )
}