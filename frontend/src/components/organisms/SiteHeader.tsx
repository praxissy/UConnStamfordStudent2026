import { Link } from 'react-router-dom'
import { LogoMarkIcon } from '@/components/atoms/icons'
import { Button } from '@/components/atoms'

export function SiteHeader({ loggedIn, onSignIn, onSignOut }: {
  loggedIn: boolean
  onSignIn: () => void
  onSignOut: () => void
}) {
  return (
    <header className="border-b border-white/10 bg-navy">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link to="/" aria-label="Praxissy home" className="flex h-7 w-7 items-center justify-center rounded bg-white/10">
          <LogoMarkIcon className="h-3.5 w-3.5 text-white" />
        </Link>

        <nav className="hidden items-center gap-7 text-xs text-white/60 md:flex">
          <Link to="/" className="transition-colors hover:text-white">Labs</Link>
          <Link to="/" className="transition-colors hover:text-white">Equipment</Link>
          <Link to="/" className="transition-colors hover:text-white">Programs</Link>
          <Link to="/dashboard" className="transition-colors hover:text-white">My portfolio</Link>
        </nav>

        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                  MS
                </div>
                <span className="hidden text-xs text-white/70 md:block">MedTech Solutions Inc.</span>
              </div>
              <button onClick={onSignOut} className="text-xs text-white/40 transition-colors hover:text-white/70">
                Sign out
              </button>
            </>
          ) : (
            <Button variant="onNavy" size="sm" onClick={onSignIn}>
              Business Login
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
