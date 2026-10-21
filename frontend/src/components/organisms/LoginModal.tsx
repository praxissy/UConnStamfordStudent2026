import { Button, FieldLabel, TextInput } from '@/components/atoms'

export function LoginModal({ onLogin, onClose }: { onLogin: () => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sign in to Student Portfolio"
        className="relative mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl"
        onClick={event => event.stopPropagation()}
      >
        <div className="bg-navy px-8 py-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold">Business Access</p>
          <h2 className="text-2xl font-bold text-white">Sign in to Student Portfolio</h2>
          <p className="mt-1 text-sm text-white/50">Access student profiles and project outcomes</p>
        </div>

        <div className="space-y-4 px-8 py-7">
          <FieldLabel label="Business email">
            <TextInput type="email" defaultValue="contact@medtechsolutions.com" />
          </FieldLabel>
          <FieldLabel label="Password">
            <TextInput type="password" defaultValue="password" />
          </FieldLabel>

          <Button variant="primary" size="lg" fullWidth onClick={onLogin} className="mt-1">
            Sign in
          </Button>

          <p className="text-center text-xs text-ink-ghost">
            Not registered?{' '}
            <a href="#" className="font-medium text-gold hover:underline">Request business access</a>
          </p>
        </div>
      </div>
    </div>
  )
}
