"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Vault, CreditCard, HelpCircle, Building2 } from "lucide-react"

const modules = [
  {
    id: "fechamento-caixa",
    name: "Fechamento de Caixa",
    icon: Calculator,
    description: "Gestão de fechamentos diários",
    href: "/fechamento-caixa",
  },
  {
    id: "cofre",
    name: "Cofre",
    icon: Vault,
    description: "Controle de movimentações",
    href: "/cofre",
  },
  {
    id: "contas-pagar",
    name: "Contas a Pagar",
    icon: CreditCard,
    description: "Gestão de pagamentos",
    href: "/contas-pagar",
  },
  {
    id: "conciliacao-bancaria",
    name: "Conciliação Bancária",
    icon: Building2,
    description: "Importação e conferência F360",
    href: "/conciliacao-bancaria",
  },
  {
    id: "solicitacoes-gerais",
    name: "Solicitações Gerais",
    icon: HelpCircle,
    description: "Tickets e chamados",
    href: "/solicitacoes-gerais",
  },
]

export default function DashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/")
    }
    if (user && user.role !== "cliente" && !user.selectedCompany) {
      router.push("/select-company")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo, {user.name}!</h1>
          <p className="text-muted-foreground">
            {user.selectedCompany
              ? `Gerenciando: ${user.selectedCompany.name}`
              : "Selecione os módulos abaixo para começar"}
          </p>
        </div>

        {/* Modules grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon
            return (
              <Card
                key={module.id}
                className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-md group bg-white hover:bg-green-50"
                onClick={() => router.push(module.href)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-green-100 rounded-full group-hover:bg-green-200 transition-colors">
                      <IconComponent className="h-8 w-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{module.name}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick stats for admin/operator */}
        {user.role !== "cliente" && (
          <div className="mt-12">
            <h2 className="text-xl font-semibold mb-4">Resumo do Dia</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">12</p>
                    <p className="text-sm text-muted-foreground">Fechamentos Pendentes</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-500">8</p>
                    <p className="text-sm text-muted-foreground">Contas a Revisar</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-500">3</p>
                    <p className="text-sm text-muted-foreground">Atrasados</p>
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-500">25</p>
                    <p className="text-sm text-muted-foreground">Concluídos Hoje</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
