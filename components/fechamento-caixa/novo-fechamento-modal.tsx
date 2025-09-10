"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, FileText, MessageSquare } from "lucide-react"

interface NovoFechamentoModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NovoFechamentoModal({ isOpen, onClose }: NovoFechamentoModalProps) {
  const [formData, setFormData] = useState({
    data: "",
    valorVendas: "",
    valorSangria: "",
    observacoes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Fechamento de Caixa</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="formulario" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formulario" className="gap-2">
              <FileText className="h-4 w-4" />
              Formulário
            </TabsTrigger>
            <TabsTrigger value="comentarios" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Comentários
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formulario" className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="data">Data do Fechamento</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="valorVendas">Valor Total de Vendas</Label>
                  <Input
                    id="valorVendas"
                    type="text"
                    placeholder="R$ 0,00"
                    value={formData.valorVendas}
                    onChange={(e) => setFormData((prev) => ({ ...prev, valorVendas: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valorSangria">Valor de Sangria (opcional)</Label>
                <Input
                  id="valorSangria"
                  type="text"
                  placeholder="R$ 0,00"
                  value={formData.valorSangria}
                  onChange={(e) => setFormData((prev) => ({ ...prev, valorSangria: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Digite observações sobre o fechamento..."
                  value={formData.observacoes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, observacoes: e.target.value }))}
                  rows={3}
                />
              </div>

              {/* File Upload */}
              <Card className="border-dashed border-2 border-muted-foreground/25">
                <CardContent className="p-6">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">Anexar comprovantes de sangria</p>
                    <Button variant="outline" type="button">
                      Selecionar Arquivos
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit">Enviar Fechamento</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="comentarios" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Nenhum comentário ainda. Os comentários aparecerão aqui após o envio do fechamento.
              </div>

              <div className="space-y-2">
                <Label htmlFor="novoComentario">Adicionar Comentário</Label>
                <Textarea id="novoComentario" placeholder="Digite seu comentário..." rows={3} />
              </div>

              <Button variant="outline" className="w-full bg-transparent">
                Adicionar Comentário
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
