"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Ticket, Clock, CheckCircle, AlertTriangle, ArrowLeft } from "lucide-react"
import SolicitacoesLista from "@/components/solicitacoes/solicitacoes-lista"
import SolicitacoesKanban from "@/components/solicitacoes/solicitacoes-kanban"
import NovoTicketModal from "@/components/solicitacoes/novo-ticket-modal"

export default function SolicitacoesGeraisPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("lista")
  const [showNovoTicket, setShowNovoTicket] = useState(false)

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/dashboard")}
              className="flex items-center gap-2 text-white hover:bg-white/10"
            >
              <ArrowLeft className="h-4 w-4 text-white" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Solicitações Gerais</h1>
              <p className="text-muted-foreground">Gestão centralizada de tickets e chamados</p>
            </div>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white" onClick={() => setShowNovoTicket(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Ticket
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Abertos</p>
                  <p className="text-2xl font-bold text-orange-500">23</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Em Andamento</p>
                  <p className="text-2xl font-bold text-blue-500">12</p>
                </div>
                <Ticket className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Urgentes</p>
                  <p className="text-2xl font-bold text-red-500">5</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Resolvidos Hoje</p>
                  <p className="text-2xl font-bold text-green-500">18</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 gap-2">
            <TabsTrigger value="lista">Lista</TabsTrigger>
            <TabsTrigger value="kanban">Kanban</TabsTrigger>
          </TabsList>

          <TabsContent value="lista">
            <SolicitacoesLista />
          </TabsContent>

          <TabsContent value="kanban">
            <SolicitacoesKanban />
          </TabsContent>
        </Tabs>

        <NovoTicketModal open={showNovoTicket} onOpenChange={setShowNovoTicket} />
      </div>
    </DashboardLayout>
  )
}
