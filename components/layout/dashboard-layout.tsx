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
      <div className="mx-auto max-w-[1600px]">
        <main className="pt-2 pb-16 md:pb-2 relative px-2 sm:px-3">{children}</main>
      </div>
      <Footer />
      <ChatWidget />
      <div id="dropdown-portal" className="relative z-[9999]"></div>
    </div>
  )
}
