import { useState, type ReactNode } from 'react'
import { Sidebar, TopBar } from '@/components/organisms'

/** Chrome for the signed-in student area: persistent sidebar, top bar with
 *  breadcrumbs, scrollable content region. */
export function DashboardLayout({ breadcrumbs, children }: {
  breadcrumbs: string[]
  children: ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-surface">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar breadcrumbs={breadcrumbs} onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto px-4 py-5 sm:px-7 sm:py-6">{children}</main>
      </div>
    </div>
  )
}
