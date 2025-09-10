"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, DollarSign } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login, isLoading } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    const success = await login(email, password)
    if (!success) {
      setError("Email ou senha inválidos")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 text-3xl font-bold text-primary">
            <DollarSign className="h-8 w-8" />
            Full Ca$h
          </div>
          <p className="text-muted-foreground mt-2">BPO Financeiro</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entrar na sua conta</CardTitle>
            <CardDescription>Digite suas credenciais para acessar o sistema</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Digite sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 text-destructive text-sm">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full h-12 text-base font-medium" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button className="text-primary hover:underline text-sm">Esqueceu sua senha?</button>
            </div>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Credenciais de teste:</p>
              <div className="text-xs space-y-1 text-muted-foreground">
                <p>Cliente: cliente@mail.com</p>
                <p>Operador: operador@mail.com</p>
                <p>Admin: admin@mail.com</p>
                <p>Senha: 123456</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
