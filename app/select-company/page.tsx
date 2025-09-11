"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, DollarSign } from "lucide-react"

export default function SelectCompanyPage() {
  const { user, companies, selectCompany, logout } = useAuth()
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
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <img 
              src="/fullcash-logo.png" 
              alt="Full Ca$h" 
              className="h-16 w-auto"
            />
          </div>
          <h1 className="text-2xl font-semibold text-white">Selecione uma empresa</h1>
          <p className="text-gray-200 mt-2">Escolha a empresa que deseja gerenciar</p>
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
                <Button className="w-full bg-green-500 hover:bg-green-600 text-white border-0">
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
              logout()
              router.push("/")
            }}
            className="text-white hover:bg-white/20 hover:text-white transition-all duration-200 px-6 py-2 rounded-md border border-white/30 hover:border-white/50"
          >
            Voltar ao login
          </Button>
        </div>
      </div>
    </div>
  )
}
