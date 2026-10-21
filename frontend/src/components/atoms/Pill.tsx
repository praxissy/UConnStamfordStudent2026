export function Pill({ label, dark }: { label: string; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium
        ${dark ? 'bg-navy text-white' : 'border border-line-strong bg-white text-ink-muted'}`}
    >
      {label}
    </span>
  )
}
