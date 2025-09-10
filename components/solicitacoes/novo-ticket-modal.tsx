"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NovoTicketModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function NovoTicketModal({ open, onOpenChange }: NovoTicketModalProps) {
  const [activeTab, setActiveTab] = useState("formulario")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Novo Ticket</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="formulario">Formulário</TabsTrigger>
            <TabsTrigger value="comentarios">Comentários</TabsTrigger>
          </TabsList>

          <TabsContent value="formulario" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="titulo">Título *</Label>
                <Input id="titulo" placeholder="Descreva brevemente o problema" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="cliente">Cliente</Label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione o cliente</option>
                  <option value="abc">Empresa ABC Ltda</option>
                  <option value="xyz">Loja XYZ</option>
                  <option value="123">Comércio 123</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="fila">Fila *</Label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione a fila</option>
                  <option value="tecnico">Técnico</option>
                  <option value="suporte">Suporte</option>
                  <option value="administrativo">Administrativo</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tema">Tema</Label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione o tema</option>
                  <option value="sistema">Sistema</option>
                  <option value="processo">Processo</option>
                  <option value="acesso">Acesso</option>
                  <option value="integracao">Integração</option>
                </select>
              </div>
              <div>
                <Label htmlFor="prioridade">Prioridade *</Label>
                <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="">Selecione a prioridade</option>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="critica">Crítica</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="descricao">Descrição *</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva detalhadamente o problema ou solicitação..."
                className="mt-1 min-h-[120px]"
              />
            </div>

            <div>
              <Label htmlFor="anexos">Anexos</Label>
              <Input id="anexos" type="file" multiple className="mt-1" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls" />
              <p className="text-xs text-gray-500 mt-1">
                Formatos aceitos: PDF, JPG, PNG, Excel (máximo 10MB por arquivo)
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button className="bg-green-500 hover:bg-green-600 text-white">Criar Ticket</Button>
            </div>
          </TabsContent>

          <TabsContent value="comentarios" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <p>Os comentários aparecerão aqui após a criação do ticket.</p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
