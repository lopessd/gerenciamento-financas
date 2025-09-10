"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, MessageSquare, CheckCircle, Download, Search, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const mockConciliados = [
  {
    id: 1,
    fornecedor: "Fornecedor ABC Ltda",
    valor: "R$ 2.450,00",
    vencimento: "2025-01-20",
    dataPagamento: "2025-01-20",
    formaPagamento: "PIX",
    status: "pago",
    comprovante: "comprovante_001.pdf",
    comentarios: 1,
  },
  {
    id: 2,
    fornecedor: "Empresa XYZ S.A.",
    valor: "R$ 1.280,00",
    vencimento: "2025-01-18",
    dataPagamento: "2025-01-18",
    formaPagamento: "TED",
    status: "pago",
    comprovante: "comprovante_002.pdf",
    comentarios: 0,
  },
  {
    id: 3,
    fornecedor: "Serviços DEF ME",
    valor: "R$ 850,00",
    vencimento: "2025-01-15",
    dataPagamento: "2025-01-15",
    formaPagamento: "Boleto",
    status: "pago",
    comprovante: "comprovante_003.pdf",
    comentarios: 2,
  },
  {
    id: 4,
    fornecedor: "Produtos GHI Ltda",
    valor: "R$ 3.200,00",
    vencimento: "2025-01-12",
    dataPagamento: "2025-01-12",
    formaPagamento: "PIX",
    status: "pago",
    comprovante: "comprovante_004.pdf",
    comentarios: 0,
  },
  {
    id: 5,
    fornecedor: "Materiais JKL Ltda",
    valor: "R$ 1.650,00",
    vencimento: "2025-01-10",
    dataPagamento: "2025-01-10",
    formaPagamento: "TED",
    status: "pago",
    comprovante: "comprovante_005.pdf",
    comentarios: 1,
  },
]

export default function ContasConciliado() {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Pagamentos Conciliados</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar fornecedor..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" className="gap-2 bg-transparent">
                <Download className="h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Pago</p>
                <p className="text-2xl font-bold text-green-600">R$ 89.450</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pagamentos</p>
                <p className="text-2xl font-bold text-foreground">45</p>
              </div>
              <Badge className="bg-green-100 text-green-700">Concluídos</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Média Diária</p>
                <p className="text-2xl font-bold text-blue-600">R$ 4.230</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Economia</p>
                <p className="text-2xl font-bold text-green-600">R$ 1.250</p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Descontos
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conciliados Table */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fornecedor</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Vencimento</TableHead>
                <TableHead>Data Pagamento</TableHead>
                <TableHead>Forma Pagamento</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Comentários</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockConciliados.map((pagamento) => (
                <TableRow key={pagamento.id}>
                  <TableCell className="font-medium">{pagamento.fornecedor}</TableCell>
                  <TableCell className="font-bold text-green-600">{pagamento.valor}</TableCell>
                  <TableCell>{new Date(pagamento.vencimento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>{new Date(pagamento.dataPagamento).toLocaleDateString("pt-BR")}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {pagamento.formaPagamento}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-100 text-green-700 gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Pago
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {pagamento.comentarios > 0 && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{pagamento.comentarios}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Resumo por Forma de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">PIX</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 45.230</p>
                  <p className="text-xs text-muted-foreground">18 pagamentos</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-sm">TED</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 32.120</p>
                  <p className="text-xs text-muted-foreground">15 pagamentos</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full" />
                  <span className="text-sm">Boleto</span>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ 12.100</p>
                  <p className="text-xs text-muted-foreground">12 pagamentos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle>Principais Fornecedores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Fornecedor ABC Ltda</span>
                <div className="text-right">
                  <p className="font-medium">R$ 12.450</p>
                  <p className="text-xs text-muted-foreground">8 pagamentos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Empresa XYZ S.A.</span>
                <div className="text-right">
                  <p className="font-medium">R$ 8.230</p>
                  <p className="text-xs text-muted-foreground">6 pagamentos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Produtos GHI Ltda</span>
                <div className="text-right">
                  <p className="font-medium">R$ 6.780</p>
                  <p className="text-xs text-muted-foreground">4 pagamentos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Serviços DEF ME</span>
                <div className="text-right">
                  <p className="font-medium">R$ 4.120</p>
                  <p className="text-xs text-muted-foreground">5 pagamentos</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
