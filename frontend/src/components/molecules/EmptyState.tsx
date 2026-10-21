export function EmptyState({ title, body }: { title: string; body?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      {body && <p className="mt-2 text-sm text-ink-faint">{body}</p>}
    </div>
  )
}
