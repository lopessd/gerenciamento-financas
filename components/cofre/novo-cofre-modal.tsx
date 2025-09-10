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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, FileText, MessageSquare, ArrowUpCircle, ArrowDownCircle, RefreshCw } from "lucide-react"

interface NovoCofreModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function NovoCofreModal({ isOpen, onClose }: NovoCofreModalProps) {
  const [formData, setFormData] = useState({
    tipo: "",
    data: "",
    valor: "",
    descricao: "",
    observacoes: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Movimentação de Cofre</DialogTitle>
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
                  <Label htmlFor="tipo">Tipo de Movimentação</Label>
                  <Select
                    value={formData.tipo}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entrada">
                        <div className="flex items-center gap-2">
                          <ArrowUpCircle className="h-4 w-4 text-green-500" />
                          Entrada
                        </div>
                      </SelectItem>
                      <SelectItem value="saida">
                        <div className="flex items-center gap-2">
                          <ArrowDownCircle className="h-4 w-4 text-red-500" />
                          Saída
                        </div>
                      </SelectItem>
                      <SelectItem value="transferencia">
                        <div className="flex items-center gap-2">
                          <RefreshCw className="h-4 w-4 text-blue-500" />
                          Transferência
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="data">Data da Movimentação</Label>
                  <Input
                    id="data"
                    type="date"
                    value={formData.data}
                    onChange={(e) => setFormData((prev) => ({ ...prev, data: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="text"
                  placeholder="R$ 0,00"
                  value={formData.valor}
                  onChange={(e) => setFormData((prev) => ({ ...prev, valor: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  type="text"
                  placeholder="Descreva a movimentação..."
                  value={formData.descricao}
                  onChange={(e) => setFormData((prev) => ({ ...prev, descricao: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Digite observações adicionais..."
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
                    <p className="text-sm text-muted-foreground mb-2">Anexar documentos comprobatórios</p>
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
                <Button type="submit">Registrar Movimentação</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="comentarios" className="space-y-4">
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                Nenhum comentário ainda. Os comentários aparecerão aqui após o registro da movimentação.
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
