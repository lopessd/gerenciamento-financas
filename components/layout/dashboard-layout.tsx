import type { ReactNode } from "react"
import Header from "./header"
import Footer from "./footer"
import ChatWidget from "@/components/chat/chat-widget"

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-teal-900 overflow-visible">
      <Header />
      <main className="pt-4 pb-20 md:pb-4 relative">{children}</main>
      <Footer />
      <ChatWidget />
      <div id="dropdown-portal" className="relative z-[9999]"></div>
    </div>
  )
}
