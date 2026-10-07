import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import DashboardHeader from '../components/dashboard/DashboardHeader'
import Sidebar from '../components/dashboard/Sidebar'

export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f8fafc] text-ink">
      {/* Sidebar (Desktop fixed + Mobile drawer) */}
      <Sidebar isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main App Content Area */}
      <div className="flex min-h-screen flex-col md:pl-64">
        {/* App Header */}
        <DashboardHeader onOpenMobile={() => setMobileOpen(true)} />

        {/* Dynamic Route Content */}
        <main className="flex-1 px-5 py-8 sm:px-8 sm:py-10">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
