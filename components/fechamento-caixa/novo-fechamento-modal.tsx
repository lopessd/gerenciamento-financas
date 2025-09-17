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
    saldoFinal: 0,
    observacoes: '',
    anexos: []
  })

  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [temAlteracoes, setTemAlteracoes] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const total = Object.values(dados.vendas).reduce((acc, val) => {
      if (typeof val === 'number') return acc + val
      return acc
    }, 0) - dados.vendas.total

    setDados(prev => ({
      ...prev,
      vendas: { ...prev.vendas, total },
      saldoFinal: prev.saldoAbertura + total + prev.suprimento - prev.sangrias
    }))
  }, [dados.vendas.boleto, dados.vendas.dinheiro, dados.vendas.cartaoDebito, dados.vendas.cartaoCredito, dados.vendas.pix, dados.vendas.transferencia, dados.vendas.outros, dados.saldoAbertura, dados.suprimento, dados.sangrias])

  useEffect(() => {
    const hasChanges = dados.titulo !== '' ||
                      dados.saldoAbertura !== 0 ||
                      Object.values(dados.vendas).some(v => typeof v === 'number' && v !== 0) ||
                      dados.suprimento !== 0 ||
                      dados.sangrias !== 0 ||
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

  const parseMoeda = (valor: string): number => {
    const numericValue = valor.replace(/[^\d,]/g, '').replace(',', '.')
    return parseFloat(numericValue) || 0
  }

  const handleInputChange = (campo: keyof FechamentoDados, valor: any) => {
    setDados(prev => ({ ...prev, [campo]: valor }))
  }

  const handleVendasChange = (tipo: keyof typeof dados.vendas, valor: string) => {
    if (tipo === 'total') return
    const numericValue = parseMoeda(valor)
    setDados(prev => ({
      ...prev,
      vendas: { ...prev.vendas, [tipo]: numericValue }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
              </div>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Saldo de Abertura
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="saldoAbertura" className="text-sm font-medium">
                      Valor do Saldo de Abertura
                    </Label>
                    <Input
                      id="saldoAbertura"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={dados.saldoAbertura || ''}
                      onChange={(e) => handleInputChange('saldoAbertura', parseFloat(e.target.value) || 0)}
                      className="w-full"
                    />
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
                      <Label htmlFor="boleto" className="text-sm font-medium">
                        Boleto
                      </Label>
                      <Input
                        id="boleto"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.boleto || ''}
                        onChange={(e) => handleVendasChange('boleto', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dinheiro" className="text-sm font-medium">
                        Dinheiro
                      </Label>
                      <Input
                        id="dinheiro"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.dinheiro || ''}
                        onChange={(e) => handleVendasChange('dinheiro', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cartaoDebito" className="text-sm font-medium">
                        Cartão Débito
                      </Label>
                      <Input
                        id="cartaoDebito"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.cartaoDebito || ''}
                        onChange={(e) => handleVendasChange('cartaoDebito', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cartaoCredito" className="text-sm font-medium">
                        Cartão Crédito
                      </Label>
                      <Input
                        id="cartaoCredito"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.cartaoCredito || ''}
                        onChange={(e) => handleVendasChange('cartaoCredito', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pix" className="text-sm font-medium">
                        PIX
                      </Label>
                      <Input
                        id="pix"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.pix || ''}
                        onChange={(e) => handleVendasChange('pix', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transferencia" className="text-sm font-medium">
                        Transferência
                      </Label>
                      <Input
                        id="transferencia"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.transferencia || ''}
                        onChange={(e) => handleVendasChange('transferencia', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="outros" className="text-sm font-medium">
                        Outros
                      </Label>
                      <Input
                        id="outros"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.vendas.outros || ''}
                        onChange={(e) => handleVendasChange('outros', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-green-600">
                        Total Vendas
                      </Label>
                      <div className="px-3 py-2 bg-green-50 border border-green-200 rounded-md text-green-700 font-semibold">
                        {formatarMoeda(dados.vendas.total)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
                      <Label htmlFor="suprimento" className="text-sm font-medium">
                        Suprimento
                      </Label>
                      <Input
                        id="suprimento"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.suprimento || ''}
                        onChange={(e) => handleInputChange('suprimento', parseFloat(e.target.value) || 0)}
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sangrias" className="text-sm font-medium">
                        Sangrias
                      </Label>
                      <Input
                        id="sangrias"
                        type="number"
                        step="0.01"
                        placeholder="0,00"
                        value={dados.sangrias || ''}
                        onChange={(e) => handleInputChange('sangrias', parseFloat(e.target.value) || 0)}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Calculator className="h-5 w-5 text-green-600" />
                    Resumo Financeiro
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded border">
                      <p className="text-sm text-gray-600 font-medium">Saldo Abertura</p>
                      <p className="text-lg font-bold text-gray-700">{formatarMoeda(dados.saldoAbertura)}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded border border-green-200">
                      <p className="text-sm text-green-600 font-medium">Total Vendas</p>
                      <p className="text-lg font-bold text-green-700">{formatarMoeda(dados.vendas.total)}</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded border border-orange-200">
                      <p className="text-sm text-orange-600 font-medium">Suprimento</p>
                      <p className="text-lg font-bold text-orange-700">{formatarMoeda(dados.suprimento)}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded border border-red-200">
                      <p className="text-sm text-red-600 font-medium">Sangrias</p>
                      <p className="text-lg font-bold text-red-700">{formatarMoeda(dados.sangrias)}</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center p-4 bg-green-50 rounded border-2 border-green-200">
                    <p className="text-sm text-gray-600 font-medium">Saldo Final Calculado</p>
                    <p className="text-2xl font-bold text-green-700">{formatarMoeda(dados.saldoFinal)}</p>
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

              <Card className="border border-gray-200">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="h-5 w-5 text-green-600" />
                    Anexos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center hover:border-gray-400 transition-colors">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Anexar comprovantes (imagens ou PDF)
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
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Selecionar Arquivos
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
    </>
  )
}