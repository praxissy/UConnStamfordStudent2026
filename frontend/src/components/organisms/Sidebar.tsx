import { NavLink } from 'react-router-dom'
import {
  BellIcon, BookIcon, CloseIcon, FolderIcon, GridIcon, SettingsIcon, UsersIcon,
} from '@/components/atoms/icons'

const NAV_ITEMS = [
  { icon: GridIcon, label: 'Overview', to: '/dashboard' },
  { icon: FolderIcon, label: 'Portfolio', to: '/dashboard' },
  { icon: BookIcon, label: 'Courses', to: '/dashboard' },
  { icon: UsersIcon, label: 'Collaborators', to: '/dashboard' },
  { icon: BellIcon, label: 'Notifications', to: '/dashboard' },
  { icon: SettingsIcon, label: 'Settings', to: '/dashboard' },
]

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <>
      <button
        type="button"
        aria-label="Close navigation"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-navy/45 transition-opacity lg:hidden
          ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      />

      <aside
        id="primary-navigation"
        className={`fixed inset-y-0 left-0 z-50 flex min-h-screen w-60 shrink-0 flex-col bg-navy
          shadow-2xl transition-transform duration-200
          lg:static lg:z-auto lg:translate-x-0 lg:shadow-none
          ${open ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="border-b border-white/10 px-6 py-5">
          <div className="flex items-center justify-between gap-2.5">
            <NavLink to="/" className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z" />
                  <path d="M3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762z" />
                  <path d="M9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524z" />
                </svg>
              </span>
              <span className="text-lg font-bold tracking-tight text-white">Praxissy</span>
            </NavLink>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white lg:hidden"
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold text-sm font-semibold text-white">
              JK
            </div>
            <div>
              <div className="text-sm font-medium text-white">Jordan Kim</div>
              <div className="text-xs text-white/50">Computer Science, Yr 3</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {NAV_ITEMS.map(({ icon: Icon, label }) => {
            const active = label === 'Portfolio'
            return (
              <button
                key={label}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors
                  ${active ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white/90'}`}
              >
                <Icon className={`h-4 w-4 ${active ? 'text-white' : 'text-white/50'}`} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-white/10 px-5 pb-6 pt-2">
          <div className="text-xs text-white/30">© 2026 Praxissy</div>
          <div className="mt-0.5 text-xs text-white/20">v2.4.1</div>
        </div>
      </aside>
    </>
  )
}
