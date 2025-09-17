"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, MessageSquare, CheckCircle, RotateCcw, Search, Bot, FileText } from "lucide-react"

const mockDocumentos = [
  {
    id: 1,
    fornecedor: "Fornecedor ABC Ltda",
    valor: "R$ 2.450,00",
    vencimento: "2025-01-25",
    status: "ia_processando",
    confianca: 95,
    documento: "Nota Fiscal 12345",
    comentarios: 0,
  },
  {
    id: 2,
    fornecedor: "Empresa XYZ S.A.",
    valor: "R$ 1.280,00",
    vencimento: "2025-01-28",
    status: "validacao_cliente",
    confianca: 88,
    documento: "Boleto Bancário",
    comentarios: 1,
  },
  {
    id: 3,
    fornecedor: "Serviços DEF ME",
    valor: "R$ 850,00",
    vencimento: "2025-01-30",
    status: "revisao_operador",
    confianca: 92,
    documento: "Recibo de Serviço",
    comentarios: 2,
  },
  {
    id: 4,
    fornecedor: "Produtos GHI Ltda",
    valor: "R$ 3.200,00",
    vencimento: "2025-02-02",
    status: "erro_ia",
    confianca: 45,
    documento: "Nota Fiscal 67890",
    comentarios: 0,
  },
]

const getStatusBadge = (status: string, confianca: number) => {
  const variants = {
    ia_processando: {
      variant: "outline" as const,
      className: "bg-blue-50 text-blue-700 border-blue-200",
      label: "IA Processando",
      icon: <Bot className="h-3 w-3" />,
    },
    validacao_cliente: {
      variant: "secondary" as const,
      className: "bg-yellow-100 text-yellow-700",
      label: "Validação Cliente",
      icon: <Eye className="h-3 w-3" />,
    },
    revisao_operador: {
      variant: "outline" as const,
      className: "bg-orange-100 text-orange-700",
      label: "Revisão Operador",
      icon: <CheckCircle className="h-3 w-3" />,
    },
    erro_ia: {
      variant: "destructive" as const,
      className: "",
      label: "Erro IA",
      icon: <RotateCcw className="h-3 w-3" />,
    },
  }

  const config = variants[status as keyof typeof variants] || variants.ia_processando
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="status" className={`${config.className} gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
      {confianca && <div className="text-xs text-muted-foreground">Confiança: {confianca}%</div>}
    </div>
  )
}

export default function ContasProcessamento() {
  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card className="border-0 shadow-md">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Documentos em Processamento</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar fornecedor..." className="pl-10 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockDocumentos.map((documento) => (
          <Card key={documento.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{documento.documento}</span>
                  </div>
                  {getStatusBadge(documento.status, documento.confianca)}
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Fornecedor</p>
                    <p className="font-medium text-foreground">{documento.fornecedor}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Valor</p>
                      <p className="font-bold text-lg text-primary">{documento.valor}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vencimento</p>
                      <p className="font-medium">{new Date(documento.vencimento).toLocaleDateString("pt-BR")}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-1">
                    {documento.comentarios > 0 && (
                      <>
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{documento.comentarios}</span>
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    {documento.status === "validacao_cliente" && (
                      <Button size="sm" className="text-xs">
                        Validar
                      </Button>
                    )}
                    {documento.status === "revisao_operador" && (
                      <>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* AI Processing Info */}
      <Card className="border-0 shadow-md bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="font-semibold text-blue-900">Processamento por IA</h3>
              <p className="text-sm text-blue-700">
                A IA está extraindo automaticamente dados dos documentos. Documentos com confiança acima de 90% são
                enviados diretamente para validação do cliente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
