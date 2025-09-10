"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import LoginPage from "@/components/login-page"

export default function HomePage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && user) {
      if (user.role === "cliente" || user.selectedCompany) {
        router.push("/dashboard")
      } else {
        router.push("/select-company")
      }
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
    return <LoginPage />
  }

  return null
}
