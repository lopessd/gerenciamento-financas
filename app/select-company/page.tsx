"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, DollarSign } from "lucide-react"

export default function SelectCompanyPage() {
  const { user, companies, selectCompany } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user || user.role === "cliente") {
      router.push("/")
    }
  }, [user, router])

  const handleSelectCompany = (company: any) => {
    selectCompany(company)
    router.push("/dashboard")
  }

  if (!user || user.role === "cliente") {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary mb-2">
            <DollarSign className="h-8 w-8" />
            Full Ca$h
          </div>
          <h1 className="text-2xl font-semibold text-foreground">Selecione uma empresa</h1>
          <p className="text-muted-foreground mt-2">Escolha a empresa que deseja gerenciar</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {companies.map((company) => (
            <Card
              key={company.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-0 shadow-md"
              onClick={() => handleSelectCompany(company)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{company.name}</CardTitle>
                    <CardDescription className="text-sm">CNPJ: {company.cnpj}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button className="w-full bg-transparent" variant="outline">
                  Selecionar Empresa
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => {
              // logout logic would go here
              router.push("/")
            }}
          >
            Voltar ao login
          </Button>
        </div>
      </div>
    </div>
  )
}
