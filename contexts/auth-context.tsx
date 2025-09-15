"use client"

import { createContext, useContext, useState, useEffect, useMemo, useCallback, type ReactNode } from "react"

interface User {
  id: string
  email: string
  name: string
  role: "cliente" | "operador" | "admin"
  selectedCompany?: Company
}

interface Company {
  id: string
  name: string
  cnpj: string
}

interface AuthContextType {
  user: User | null
  companies: Company[]
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  selectCompany: (company: Company) => void
  switchCompany: (company: Company) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock data for demonstration
const mockUsers = [
  { id: "1", email: "cliente@mail.com", name: "Cliente Teste", role: "cliente" as const },
  { id: "2", email: "operador@mail.com", name: "Operador Teste", role: "operador" as const },
  { id: "3", email: "admin@mail.com", name: "Admin Teste", role: "admin" as const },
]

const mockCompanies = [
  { id: "1", name: "Supermercado ABC", cnpj: "12.345.678/0001-90" },
  { id: "2", name: "Farmácia XYZ", cnpj: "98.765.432/0001-10" },
  { id: "3", name: "Loja de Roupas DEF", cnpj: "11.222.333/0001-44" },
  { id: "4", name: "Padaria GHI", cnpj: "22.333.444/0001-55" },
  { id: "5", name: "Mercado JKL", cnpj: "33.444.555/0001-66" },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [companies] = useState<Company[]>(mockCompanies)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    
    const loadAuthData = async () => {
      try {
        const storedUser = localStorage.getItem("fullcash-user")
        if (storedUser && isMounted) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Error loading auth data:', error)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }
    
    loadAuthData()
    
    return () => {
      isMounted = false
    }
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const foundUser = mockUsers.find((u) => u.email === email)
      if (foundUser && password === "123456") {
        setUser(foundUser)
        localStorage.setItem("fullcash-user", JSON.stringify(foundUser))
        return true
      }
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem("fullcash-user")
  }, [])

  const selectCompany = useCallback((company: Company) => {
    if (user) {
      const updatedUser = { ...user, selectedCompany: company }
      setUser(updatedUser)
      localStorage.setItem("fullcash-user", JSON.stringify(updatedUser))
    }
  }, [user])

  const switchCompany = useCallback((company: Company) => {
    if (user && (user.role === "operador" || user.role === "admin")) {
      const updatedUser = { ...user, selectedCompany: company }
      setUser(updatedUser)
      localStorage.setItem("fullcash-user", JSON.stringify(updatedUser))
    }
  }, [user])

  const value = useMemo(
    () => ({
      user,
      companies,
      login,
      logout,
      selectCompany,
      switchCompany,
      isLoading,
    }),
    [user, companies, isLoading]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
