"use client"

import { useState } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, List, ArrowLeft } from "lucide-react"
import FechamentoCalendar from "@/components/fechamento-caixa/fechamento-calendar"
import FechamentoList from "@/components/fechamento-caixa/fechamento-list"
import NovoFechamentoModal from "@/components/fechamento-caixa/novo-fechamento-modal"
import { useRouter } from "next/navigation"

export default function FechamentoCaixaPage() {
  const [activeTab, setActiveTab] = useState("calendar")
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
              <h1 className="text-3xl font-bold text-white">Fechamento de Caixa</h1>
              <p className="text-gray-200">Gestão de fechamentos diários</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4" />
            Novo Fechamento
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-500">8</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Revisão
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Atrasados</p>
                  <p className="text-2xl font-bold text-red-500">3</p>
                </div>
                <Badge className="bg-red-500 text-white hover:bg-red-600">Urgente</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Concluídos</p>
                  <p className="text-2xl font-bold text-green-500">25</p>
                </div>
                <Badge className="bg-green-100 text-green-700">OK</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="text-2xl font-bold text-foreground">36</p>
                </div>
                <Badge variant="outline">Mês</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
    <TabsList className="grid w-full grid-cols-2 mb-6 gap-2">
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <FechamentoCalendar />
          </TabsContent>

          <TabsContent value="list">
            <FechamentoList />
          </TabsContent>

        </Tabs>

        {/* Modal */}
        <NovoFechamentoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  )
}
