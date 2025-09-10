"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react"

export default function FechamentoDashboard() {
  return (
    <div className="space-y-6">
      {/* Performance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média Diária</p>
                <p className="text-2xl font-bold">R$ 8.450</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">+12%</span>
                </div>
              </div>
              <DollarSign className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tempo Médio</p>
                <p className="text-2xl font-bold">2.5h</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-500">-8%</span>
                </div>
              </div>
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
              <p className="text-2xl font-bold">89%</p>
              <Progress value={89} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-6">
            <div>
              <p className="text-sm text-muted-foreground">Eficiência</p>
              <p className="text-2xl font-bold">94%</p>
              <Progress value={94} className="mt-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Fechamentos por Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-sm">Conciliados</span>
                </div>
                <span className="font-medium">25 (69%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm">Pendentes</span>
                </div>
                <span className="font-medium">8 (22%)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-sm">Atrasados</span>
                </div>
                <span className="font-medium">3 (9%)</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Empresas Mais Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Supermercado ABC</span>
                <span className="font-medium">12 fechamentos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Farmácia XYZ</span>
                <span className="font-medium">8 fechamentos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Loja de Roupas DEF</span>
                <span className="font-medium">6 fechamentos</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Padaria GHI</span>
                <span className="font-medium">5 fechamentos</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
