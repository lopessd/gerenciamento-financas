"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import GenericSkeleton from "@/components/skeletons/generic-skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Calendar, List, ArrowLeft, LayoutGrid } from "lucide-react"
import FechamentoCalendar from "@/components/fechamento-caixa/fechamento-calendar"
import FechamentoList from "@/components/fechamento-caixa/fechamento-list"
import FechamentoKanban from "@/components/fechamento-caixa/fechamento-kanban"
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
               fechamentoCard.status === "finalizado_concluido" ? "COMPLETED" :
               fechamentoCard.status === "em_andamento_analise" ? "IN_REVIEW" :
               fechamentoCard.status === "em_andamento_pendencia" ? "RETURNED" :
               "PENDING") as "IN_REVIEW" | "RETURNED" | "COMPLETED" | "PENDING",
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
      tipoFinalizacao: fechamentoCard.tipoFinalizacao,
      // Adicionar dados editados especificamente para a Farmácia XYZ
      ...(fechamentoCard.empresa === "Farmácia XYZ" && {
        dadosEditados: {
          saldoAbertura: 1200.00, // Editado: era 1000.00
          vendas: {
            boleto: 2500.00,
            dinheiro: 1500.00, // Editado: era 1200.00
            cartaoDebito: 3200.00,
            cartaoCredito: 4100.00,
            pix: 2100.00, // Editado: era 1800.00
            transferencia: 950.00,
            outros: 300.00,
            total: 14550.00 // Total recalculado
          },
          suprimento: 700.00, // Editado: era 500.00
          sangrias: 600.00, // Editado: era 800.00
          saldoFinal: 15850.00, // Recalculado: 1200 + 14550 + 700 - 600
          anexos: [
            {
              id: "1",
              name: "fechamento-farmacia.pdf",
              url: "/mock/fechamento.pdf",
              size: 1024
            },
            {
              id: "2",
              name: "comprovante-correcao.pdf",
              url: "/mock/comprovante.pdf",
              size: 512
            }
          ],
          editadoEm: "2025-01-18T14:30:00.000Z",
          editadoPor: "Maria Santos (Operadora)"
        }
      }),
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
  <div className="w-full px-0 sm:px-0 py-0 sm:py-2 pb-0 md:pb-2">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-3 gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="text-white hover:bg-white/20 shrink-0">
              <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </Button>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white truncate">Fechamento de Caixa</h1>
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


        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="!inline-flex !w-auto !h-auto mb-3 sm:mb-4 !p-0 !justify-start !max-w-none !bg-transparent !border-0 gap-1">
            <TabsTrigger value="calendar" className="!flex !items-center gap-1 sm:gap-2 text-[11px] sm:text-sm !h-7 sm:!h-8 !py-1 !px-2 sm:!px-3 !w-auto !min-w-0 !bg-white/90 !text-gray-700 hover:!bg-white hover:!text-gray-900 data-[state=active]:!bg-green-600 data-[state=active]:!text-white !border !border-gray-300 data-[state=active]:!border-green-600 !rounded-md !shadow-sm">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Calendário</span>
              <span className="sm:hidden">Cal</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="!flex !items-center gap-1 sm:gap-2 text-[11px] sm:text-sm !h-7 sm:!h-8 !py-1 !px-2 sm:!px-3 !w-auto !min-w-0 !bg-white/90 !text-gray-700 hover:!bg-white hover:!text-gray-900 data-[state=active]:!bg-green-600 data-[state=active]:!text-white !border !border-gray-300 data-[state=active]:!border-green-600 !rounded-md !shadow-sm">
              <List className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Lista</span>
              <span className="sm:hidden">Lista</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="!flex !items-center gap-1 sm:gap-2 text-[11px] sm:text-sm !h-7 sm:!h-8 !py-1 !px-2 sm:!px-3 !w-auto !min-w-0 !bg-white/90 !text-gray-700 hover:!bg-white hover:!text-gray-900 data-[state=active]:!bg-green-600 data-[state=active]:!text-white !border !border-gray-300 data-[state=active]:!border-green-600 !rounded-md !shadow-sm">
              <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              <span className="hidden sm:inline whitespace-nowrap">Kanban</span>
              <span className="sm:hidden">Kanban</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar">
            <FechamentoCalendar />
          </TabsContent>

          <TabsContent value="list">
            <FechamentoList onViewFechamento={handleViewFechamento} />
          </TabsContent>

          <TabsContent value="kanban">
            <FechamentoKanban onViewFechamento={handleViewFechamento} />
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
