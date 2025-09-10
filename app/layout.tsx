import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import { ChatProvider } from "@/contexts/chat-context"
import { Suspense } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "Full Ca$h - BPO Financeiro",
  description: "Sistema de gestão financeira para BPO",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <AuthProvider>
            <ChatProvider>{children}</ChatProvider>
          </AuthProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
