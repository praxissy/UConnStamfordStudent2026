/** The "View lab →" affordance on a card. Not a button — the whole card is the
 *  button, so this is presentational only. */
export function CardAction({ children }: { children: string }) {
  return (
    <span
      className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-line-strong bg-white
        px-3 text-sm font-semibold text-ink shadow-sm transition-colors
        group-hover:border-gold group-hover:text-gold-deep"
    >
      {children}
      <span aria-hidden="true">→</span>
    </span>
  )
}
