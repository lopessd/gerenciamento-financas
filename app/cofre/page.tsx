"use client"

import { useState, useEffect } from "react"
import DashboardLayout from "@/components/layout/dashboard-layout"
import CofreSkeleton from "@/components/skeletons/cofre-skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, List, BarChart3, ArrowLeft } from "lucide-react"
import CofreCalendar from "@/components/cofre/cofre-calendar"
import CofreList from "@/components/cofre/cofre-list"
import CofreDashboard from "@/components/cofre/cofre-dashboard"
import NovoCofreModal from "@/components/cofre/novo-cofre-modal"
import { useRouter } from "next/navigation"

export default function CofrePage() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [statsData, setStatsData] = useState(null)
  const router = useRouter()

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 200))
      setStatsData({
        saldoInicial: 15450,
        saldoConferido: 14890,
        quebra: 560,
        pendentes: 5
      })
      setDataLoaded(true)
    }
    
    loadData()
  }, [])
  
  if (!dataLoaded) {
    return <CofreSkeleton />
  }

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
              <h1 className="text-3xl font-bold text-foreground">Cofre</h1>
              <p className="text-muted-foreground">Controle de movimentações financeiras</p>
            </div>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-green-500 hover:bg-green-600 text-white">
            <Plus className="h-4 w-4" />
            Novo Envio
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Inicial</p>
                  <p className="text-2xl font-bold text-blue-600">R$ 15.450</p>
                </div>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  Inicial
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Saldo Conferido</p>
                  <p className="text-2xl font-bold text-green-600">R$ 14.890</p>
                </div>
                <Badge className="bg-green-100 text-green-700">Conferido</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Quebra</p>
                  <p className="text-2xl font-bold text-red-600">R$ 560</p>
                </div>
                <Badge variant="destructive">Quebra</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">5</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                  Revisão
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 gap-2">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="calendar" className="gap-2">
              <Calendar className="h-4 w-4" />
              Calendário
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <CofreDashboard />
          </TabsContent>

          <TabsContent value="calendar">
            <CofreCalendar />
          </TabsContent>

          <TabsContent value="list">
            <CofreList />
          </TabsContent>
        </Tabs>

        {/* Modal */}
        <NovoCofreModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </DashboardLayout>
  )
}
