"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Download, FileSpreadsheet, Calendar, Building2 } from "lucide-react"

export default function ConciliacaoExportacao() {
  const exportacoes = [
    {
      id: 1,
      nome: "Conciliacao_BB_15012025.xlsx",
      data: "15/01/2025",
      banco: "Banco do Brasil",
      registros: 45,
      status: "concluido",
    },
    {
      id: 2,
      nome: "Conciliacao_Itau_14012025.xlsx",
      data: "14/01/2025",
      banco: "Itaú",
      registros: 32,
      status: "processando",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "concluido":
        return "bg-green-100 text-green-800"
      case "processando":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Gerar Nova Exportação */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Gerar Exportação F360
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="data-inicio">Data Início</Label>
              <Input id="data-inicio" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="data-fim">Data Fim</Label>
              <Input id="data-fim" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="banco-export">Banco</Label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Todos os bancos</option>
                <option value="bb">Banco do Brasil</option>
                <option value="itau">Itaú</option>
                <option value="santander">Santander</option>
                <option value="bradesco">Bradesco</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" defaultChecked />
              <span className="text-sm">Apenas conciliados</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" className="rounded" />
              <span className="text-sm">Incluir observações</span>
            </label>
          </div>

          <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
            <Download className="h-4 w-4 mr-2" />
            Gerar Exportação
          </Button>
        </CardContent>
      </Card>

      {/* Histórico de Exportações */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Histórico de Exportações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportacoes.map((exportacao) => (
              <div
                key={exportacao.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <FileSpreadsheet className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="font-medium">{exportacao.nome}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {exportacao.data}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {exportacao.banco}
                      </span>
                      <span>{exportacao.registros} registros</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="status" className={getStatusColor(exportacao.status)}>{exportacao.status}</Badge>
                  {exportacao.status === "concluido" && (
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
