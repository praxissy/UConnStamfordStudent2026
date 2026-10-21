import { LockIcon } from '@/components/atoms/icons'
import type { Domain } from '@/types'

export function DomainSwitcher({ domain, locked, onSwitch }: {
  domain: Domain
  /** Students and projects are gated behind a business login. */
  locked: boolean
  onSwitch: (domain: Domain) => void
}) {
  const base = 'w-full rounded-full px-4 py-2 text-sm font-medium transition-all'
  const on = 'bg-white text-navy'
  const off = 'text-white/50 hover:text-white/80'

  return (
    <div className="mx-auto mb-8 grid w-full max-w-md grid-cols-2 gap-2">
      <button onClick={() => onSwitch('labs')} className={`${base} ${domain === 'labs' ? on : off}`}>
        Labs &amp; Equipment
      </button>
      <button
        onClick={() => onSwitch('students')}
        className={`${base} flex items-center justify-center gap-1.5 ${domain === 'students' ? on : off}`}
      >
        Students &amp; Projects
        {locked && <LockIcon className="h-[11px] w-[11px]" />}
      </button>
    </div>
  )
}
