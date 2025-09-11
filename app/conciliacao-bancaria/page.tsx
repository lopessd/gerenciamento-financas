"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import DashboardLayout from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, FileText, AlertCircle, CheckCircle, Clock, ArrowLeft } from "lucide-react"
import ConciliacaoImportacao from "@/components/conciliacao/conciliacao-importacao"
import ConciliacaoConferencia from "@/components/conciliacao/conciliacao-conferencia"
import ConciliacaoExportacao from "@/components/conciliacao/conciliacao-exportacao"

export default function ConciliacaoBancariaPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("importacao")

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")} className="shrink-0 text-white hover:bg-white/20">
            <ArrowLeft className="h-5 w-5 text-white" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Conciliação Bancária</h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Importação e conferência de dados bancários F360
            </p>
          </div>
          <Button className="bg-green-500 hover:bg-green-600 text-white hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            Nova Importação
          </Button>
          <Button size="icon" className="bg-green-500 hover:bg-green-600 text-white sm:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats Cards - Made responsive for 320px */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendentes</p>
                  <p className="text-2xl font-bold text-orange-500">15</p>
                </div>
                <Clock className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conciliados</p>
                  <p className="text-2xl font-bold text-green-500">142</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Divergências</p>
                  <p className="text-2xl font-bold text-red-500">7</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Processado</p>
                  <p className="text-2xl font-bold text-primary">R$ 45.230</p>
                </div>
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content - Made tabs responsive */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 h-auto gap-2">
            <TabsTrigger value="importacao" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Importação F360</span>
              <span className="sm:hidden">Import.</span>
            </TabsTrigger>
            <TabsTrigger value="conferencia" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Conferência</span>
              <span className="sm:hidden">Conf.</span>
            </TabsTrigger>
            <TabsTrigger value="exportacao" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Exportação</span>
              <span className="sm:hidden">Export.</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="importacao">
            <ConciliacaoImportacao />
          </TabsContent>

          <TabsContent value="conferencia">
            <ConciliacaoConferencia />
          </TabsContent>

          <TabsContent value="exportacao">
            <ConciliacaoExportacao />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
