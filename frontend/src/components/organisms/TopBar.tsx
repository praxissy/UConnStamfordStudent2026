import { BellIcon, MenuIcon } from '@/components/atoms/icons'

export function TopBar({ breadcrumbs, onMenuClick }: {
  breadcrumbs: string[]
  onMenuClick: () => void
}) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-line bg-white px-4 sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          aria-controls="primary-navigation"
          className="-ml-1 flex h-9 w-9 items-center justify-center rounded-lg text-navy hover:bg-surface-muted lg:hidden"
        >
          <MenuIcon className="h-5 w-5" />
        </button>

        <nav className="flex min-w-0 items-center gap-2 overflow-hidden text-sm">
          {breadcrumbs.map((crumb, index) => {
            const last = index === breadcrumbs.length - 1
            return (
              <span key={crumb} className={`items-center gap-2 whitespace-nowrap ${last ? 'flex' : 'hidden sm:flex'}`}>
                {index > 0 && <span className="text-ink-ghost">›</span>}
                <span className={last ? 'truncate font-medium text-navy' : 'text-ink-ghost'}>{crumb}</span>
              </span>
            )
          })}
        </nav>
      </div>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-ink-faint transition-colors hover:bg-surface-muted"
        >
          <BellIcon className="h-4 w-4" />
        </button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-xs font-semibold text-white">
          JK
        </div>
      </div>
    </header>
  )
}
