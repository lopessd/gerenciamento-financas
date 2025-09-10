"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Upload, FileText, Calendar, Building2 } from "lucide-react"

export default function ConciliacaoImportacao() {
  const [dragActive, setDragActive] = useState(false)

  const importacoes = [
    {
      id: 1,
      arquivo: "F360_Relatorio_15012025.xlsx",
      data: "15/01/2025",
      banco: "Banco do Brasil",
      status: "processado",
      registros: 45,
    },
    {
      id: 2,
      arquivo: "F360_Relatorio_14012025.xlsx",
      data: "14/01/2025",
      banco: "Itaú",
      status: "pendente",
      registros: 32,
    },
    {
      id: 3,
      arquivo: "F360_Relatorio_13012025.xlsx",
      data: "13/01/2025",
      banco: "Santander",
      status: "erro",
      registros: 0,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "processado":
        return "bg-green-100 text-green-800"
      case "pendente":
        return "bg-yellow-100 text-yellow-800"
      case "erro":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Relatório F360
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-primary bg-primary/5" : "border-gray-300"
            }`}
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault()
              setDragActive(false)
            }}
          >
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-900 mb-2">
              Arraste o arquivo F360 aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500 mb-4">Formatos aceitos: .xlsx, .xls (máximo 10MB)</p>
            <Button variant="outline">Selecionar Arquivo</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="data-referencia">Data de Referência</Label>
              <Input id="data-referencia" type="date" className="mt-1" />
            </div>
            <div>
              <Label htmlFor="banco">Banco</Label>
              <select className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Selecione o banco</option>
                <option value="bb">Banco do Brasil</option>
                <option value="itau">Itaú</option>
                <option value="santander">Santander</option>
                <option value="bradesco">Bradesco</option>
              </select>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90">Processar Importação</Button>
        </CardContent>
      </Card>

      {/* Histórico de Importações */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Histórico de Importações</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {importacoes.map((importacao) => (
              <div
                key={importacao.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <FileText className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">{importacao.arquivo}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {importacao.data}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building2 className="h-4 w-4" />
                        {importacao.banco}
                      </span>
                      <span>{importacao.registros} registros</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(importacao.status)}>{importacao.status}</Badge>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
