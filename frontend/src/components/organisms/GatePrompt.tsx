import { Button } from '@/components/atoms'
import { LockIcon } from '@/components/atoms/icons'

export function GatePrompt({ onLoginClick }: { onLoginClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-24 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted">
        <LockIcon className="h-7 w-7 text-navy" />
      </div>
      <h2 className="mb-2 text-xl font-bold text-ink">Business login required</h2>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-ink-faint">
        Student portfolios and project outcomes are available to registered business partners.
        Sign in to access profiles and connect with researchers.
      </p>
      <Button variant="primary" size="lg" onClick={onLoginClick}>
        Sign in as a business
      </Button>
      <p className="mt-4 text-xs text-ink-ghost">
        Don&apos;t have an account?{' '}
        <a href="#" className="font-medium text-gold hover:underline">Request access</a>
      </p>
    </div>
  )
}
