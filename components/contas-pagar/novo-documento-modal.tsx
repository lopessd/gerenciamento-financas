"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, MessageSquare, Bot, CheckCircle, AlertCircle } from "lucide-react"

interface NovoDocumentoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NovoDocumentoModal({ isOpen, onClose }: NovoDocumentoModalProps) {
  const [step, setStep] = useState<"upload" | "processing" | "validation">("upload")
  const [extractedData, setExtractedData] = useState({
    fornecedor: "Fornecedor ABC Ltda",
    valor: "R$ 2.450,00",
    vencimento: "2025-01-25",
    formaPagamento: "PIX",
    confianca: 92,
  })

  const handleUpload = () => {
    setStep("processing")
    // Simulate AI processing
    setTimeout(() => {
      setStep("validation")
    }, 3000)
  }

  const handleValidation = (approved: boolean) => {
    if (approved) {
      console.log("Document approved:", extractedData)
      onClose()
      setStep("upload")
    } else {
      // Return to upload for corrections
      setStep("upload")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Documento - Contas a Pagar</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <Card className="border-dashed border-2 border-muted-foreground/25">
              <CardContent className="p-8">
                <div className="text-center">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload de Documento</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Faça upload de boletos, notas fiscais ou recibos (PDF, JPG, PNG)
                  </p>
                  <Button onClick={handleUpload} className="gap-2">
                    <Upload className="h-4 w-4" />
                    Selecionar Arquivo
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Bot className="h-6 w-6 text-blue-600" />
                  <div>
                    <h4 className="font-medium text-blue-900">Processamento Automático por IA</h4>
                    <p className="text-sm text-blue-700">
                      Nossa IA extrairá automaticamente fornecedor, valor, vencimento e forma de pagamento.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Processando Documento</h3>
              <p className="text-muted-foreground">A IA está extraindo os dados do documento...</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Documento carregado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                <span className="text-sm">Extraindo dados...</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <div className="h-4 w-4"></div>
                <span className="text-sm">Validando informações</span>
              </div>
            </div>
          </div>
        )}

        {step === "validation" && (
          <Tabs defaultValue="dados" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="dados" className="gap-2">
                <FileText className="h-4 w-4" />
                Dados Extraídos
              </TabsTrigger>
              <TabsTrigger value="comentarios" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Comentários
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dados" className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Bot className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-900">Dados extraídos com sucesso!</span>
                </div>
                <Badge className="bg-green-100 text-green-700">Confiança: {extractedData.confianca}%</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fornecedor">Fornecedor</Label>
                  <Input
                    id="fornecedor"
                    value={extractedData.fornecedor}
                    onChange={(e) => setExtractedData((prev) => ({ ...prev, fornecedor: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valor">Valor</Label>
                  <Input
                    id="valor"
                    value={extractedData.valor}
                    onChange={(e) => setExtractedData((prev) => ({ ...prev, valor: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vencimento">Vencimento</Label>
                  <Input
                    id="vencimento"
                    type="date"
                    value={extractedData.vencimento}
                    onChange={(e) => setExtractedData((prev) => ({ ...prev, vencimento: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="formaPagamento">Forma de Pagamento</Label>
                  <Input
                    id="formaPagamento"
                    value={extractedData.formaPagamento}
                    onChange={(e) => setExtractedData((prev) => ({ ...prev, formaPagamento: e.target.value }))}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => handleValidation(false)} className="gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Corrigir Dados
                </Button>
                <Button onClick={() => handleValidation(true)} className="gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Aprovar e Enviar
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="comentarios" className="space-y-4">
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Adicione comentários sobre o documento ou instruções especiais para o pagamento.
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comentario">Comentário</Label>
                  <Textarea id="comentario" placeholder="Digite seu comentário..." rows={4} />
                </div>

                <Button variant="outline" className="w-full bg-transparent">
                  Adicionar Comentário
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
