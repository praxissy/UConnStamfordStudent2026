import { SearchIcon } from '@/components/atoms/icons'

export function SearchBar({ value, placeholder, onChange, onSubmit }: {
  value: string
  placeholder: string
  onChange: (value: string) => void
  onSubmit: () => void
}) {
  return (
    <div className="relative">
      <SearchIcon className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-ghost" />
      <input
        type="text"
        value={value}
        onChange={event => onChange(event.target.value)}
        onKeyDown={event => event.key === 'Enter' && onSubmit()}
        placeholder={placeholder}
        aria-label={placeholder}
        className="w-full rounded-xl bg-white py-4 pl-11 pr-4 text-sm text-ink
          placeholder-ink-ghost shadow-sm outline-none"
      />
    </div>
  )
}
