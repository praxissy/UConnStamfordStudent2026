import type { ReactNode } from 'react'
import { SiteHeader } from '@/components/organisms'

/** Chrome for everything a business or visitor sees. Layout only — pages
 *  supply the content and the state. */
export function PublicLayout({ loggedIn, onSignIn, onSignOut, children }: {
  loggedIn: boolean
  onSignIn: () => void
  onSignOut: () => void
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader loggedIn={loggedIn} onSignIn={onSignIn} onSignOut={onSignOut} />
      {children}
    </div>
  )
}
