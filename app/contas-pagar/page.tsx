"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, CheckCircle, ArrowLeft } from "lucide-react"
import ContasProcessamento from "@/components/contas-pagar/contas-processamento"
import ContasAgendamento from "@/components/contas-pagar/contas-agendamento"
import ContasConciliado from "@/components/contas-pagar/contas-conciliado"
import NovoDocumentoModal from "@/components/contas-pagar/novo-documento-modal"
import { useRouter } from "next/navigation"

export default function ContasPagarPage() {
  const [activeTab, setActiveTab] = useState("processamento")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-5 w-5 text-white" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Contas a Pagar</h1>
              <p className="text-muted-foreground">Gestão de pagamentos com automação por IA</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4" />
            Novo Documento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Processamento</p>
                  <p className="text-2xl font-bold text-blue-600">12</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  IA
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Agendamento</p>
                  <p className="text-2xl font-bold text-orange-600">8</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Pendente
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conciliado</p>
                  <p className="text-2xl font-bold text-green-600">45</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Pago</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Valor</p>
                  <p className="text-2xl font-bold text-foreground">R$ 89.450</p>
                </div>
                <Badge variant="outline">Mês</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 gap-2">
            <TabsTrigger value="processamento" className="gap-2">
              <FileText className="h-4 w-4" />
              Processamento
            </TabsTrigger>
            <TabsTrigger value="agendamento" className="gap-2">
              <Calendar className="h-4 w-4" />
              Agendamento
            </TabsTrigger>
            <TabsTrigger value="conciliado" className="gap-2">
              <CheckCircle className="h-4 w-4" />
              Conciliado
            </TabsTrigger>
          </TabsList>

          <TabsContent value="processamento">
            <ContasProcessamento />
          </TabsContent>

          <TabsContent value="agendamento">
            <ContasAgendamento />
          </TabsContent>

          <TabsContent value="conciliado">
            <ContasConciliado />
          </TabsContent>
        </Tabs>

        {/* Modal */}
        <NovoDocumentoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  )
}
