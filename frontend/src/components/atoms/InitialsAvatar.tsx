export function InitialsAvatar({ initials, size = 'md' }: { initials: string; size?: 'sm' | 'md' }) {
  const box = size === 'sm' ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-sm'
  return (
    <div className={`${box} flex shrink-0 items-center justify-center rounded-md bg-navy`}>
      <span className="font-semibold tracking-wide text-white">{initials}</span>
    </div>
  )
}
