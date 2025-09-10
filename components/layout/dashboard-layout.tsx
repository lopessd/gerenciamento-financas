import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import ChatWidget from "@/components/chat/chat-widget"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="pb-20 md:pb-4">{children}</main>
      <Footer />
      <ChatWidget />
    </div>
  )
}
