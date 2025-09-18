"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import GenericSkeleton from "@/components/skeletons/generic-skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, List, ArrowLeft } from "lucide-react"
import FechamentoCalendar from "@/components/fechamento-caixa/fechamento-calendar"
import FechamentoList from "@/components/fechamento-caixa/fechamento-list"
import NovoFechamentoModal from "@/components/fechamento-caixa/novo-fechamento-modal"
import VisualizarFechamentoModal, { type FechamentoData } from "@/components/fechamento-caixa/visualizar-fechamento-modal"
import { useRouter } from "next/navigation"

export default function FechamentoCaixaPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("calendar")
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedFechamento, setSelectedFechamento] = useState<FechamentoData | null>(null)
  const [dataLoaded, setDataLoaded] = useState(false)
  const router = useRouter()

  // Mock data para demonstração
  const mockFechamento = {
    id: "1",
    data: "2025-01-15",
    titulo: "Fechamento Diário - Loja Centro",
    empresa: "Supermercado ABC",
    responsavel: "João Silva",
    status: "IN_REVIEW" as const,
    saldoAbertura: 1000.00,
    vendas: {
      boleto: 2500.00,
      dinheiro: 1200.00,
      cartaoDebito: 3200.00,
      cartaoCredito: 4100.00,
      pix: 1800.00,
      transferencia: 950.00,
      outros: 300.00,
      total: 14050.00
    },
    suprimento: 500.00,
    sangrias: 800.00,
    saldoFinal: 14750.00,
    observacoes: "Fechamento realizado conforme protocolo padrão. Todos os valores foram conferidos duas vezes.",
    anexos: [
      {
        id: "1",
        name: "comprovante-pix.pdf",
        url: "/mock/comprovante.pdf",
        size: 1024
      },
      {
        id: "2",
        name: "sangria-noturna.jpg",
        url: "/mock/sangria.jpg",
        size: 2048
      }
    ]
  }

  const handleViewFechamento = (fechamentoCard: any) => {
    // Converter os dados do card para o formato do modal
    const fechamentoForModal = {
      id: fechamentoCard.id.toString(),
      data: fechamentoCard.data,
      titulo: `Fechamento - ${fechamentoCard.empresa}`,
      empresa: fechamentoCard.empresa,
      responsavel: fechamentoCard.responsavel,
      status: (fechamentoCard.status === "pendente" ? "IN_REVIEW" :
               fechamentoCard.status === "atrasado" ? "RETURNED" :
               fechamentoCard.status === "conciliado" ? "COMPLETED" : "PENDING") as "IN_REVIEW" | "RETURNED" | "COMPLETED" | "PENDING",
      saldoAbertura: 1000.00,
      vendas: {
        boleto: 2500.00,
        dinheiro: 1200.00,
        cartaoDebito: 3200.00,
        cartaoCredito: 4100.00,
        pix: 1800.00,
        transferencia: 950.00,
        outros: 300.00,
        total: 14050.00
      },
      suprimento: 500.00,
      sangrias: 800.00,
      saldoFinal: 14750.00,
      observacoes: "Fechamento realizado conforme protocolo padrão. Todos os valores foram conferidos duas vezes.",
      anexos: [
        {
          id: "1",
          name: "comprovante-pix.pdf",
          url: "/mock/comprovante.pdf",
          size: 1024
        },
        {
          id: "2",
          name: "sangria-noturna.jpg",
          url: "/mock/sangria.jpg",
          size: 2048
        }
      ]
    }

    setSelectedFechamento(fechamentoForModal)
    setIsViewModalOpen(true)
  }

  useEffect(() => {
    const timer = setTimeout(() => setDataLoaded(true), 200)
    return () => clearTimeout(timer)
  }, [])
  
  if (!dataLoaded) {
    return <GenericSkeleton title="Fechamento de Caixa" showTabs={true} showTable={false} />
  }

  return (
    <DashboardLayout>
  <div className="container mx-auto px-0 sm:px-0 py-0 sm:py-6 pb-0 md:pb-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20 shrink-0">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Fechamento de Caixa</h1>
              <p className="text-gray-200 text-sm sm:text-base hidden sm:block">
                {user?.role === "cliente"
                  ? "Registre seu fechamento diário de caixa"
                  : "Visualize e aprove os fechamentos dos clientes"
                }
              </p>
            </div>
          </div>
          {user?.role === "cliente" && (
            <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-green-500 hover:bg-green-600 text-white shrink-0 w-full sm:w-auto">
              <Plus className="h-4 w-4" />
              <span className="sm:hidden">Novo</span>
              <span className="hidden sm:inline">Novo Fechamento</span>
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Pendentes</p>
                  <p className="text-lg sm:text-2xl font-bold text-orange-500">8</p>
                </div>
                <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs self-start sm:self-auto">
                  Revisão
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Atrasados</p>
                  <p className="text-lg sm:text-2xl font-bold text-red-500">3</p>
                </div>
                <Badge variant="status" className="bg-red-500 text-white text-xs self-start sm:self-auto">Urgente</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Finalizados</p>
                  <p className="text-lg sm:text-2xl font-bold text-green-500">25</p>
                </div>
                <Badge className="bg-green-100 text-green-700 text-xs self-start sm:self-auto">OK</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardContent className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-muted-foreground truncate">Total</p>
                  <p className="text-lg sm:text-2xl font-bold text-foreground">36</p>
                </div>
                <Badge variant="outline" className="text-xs self-start sm:self-auto">Mês</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 gap-1 sm:gap-2 h-10 sm:h-auto">
            <TabsTrigger value="calendar" className="gap-1 sm:gap-2 text-xs sm:text-sm h-auto py-1.5 sm:py-2">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Calendário</span>
              <span className="sm:hidden">Cal</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-1 sm:gap-2 text-xs sm:text-sm h-auto py-1.5 sm:py-2">
              <List className="h-3 w-3 sm:h-4 sm:w-4" />
              Lista
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <FechamentoCalendar />
          </TabsContent>

          <TabsContent value="list">
            <FechamentoList onViewFechamento={handleViewFechamento} />
          </TabsContent>
        </Tabs>

        {/* Modals */}
        <NovoFechamentoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        <VisualizarFechamentoModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          fechamento={selectedFechamento}
          userRole={user?.role === "admin" ? "operador" : (user?.role || "cliente")}
        />
      </div>
    </DashboardLayout>
  )
}
