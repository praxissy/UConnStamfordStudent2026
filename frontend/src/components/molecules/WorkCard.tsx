import { CardAction, InitialsAvatar, Pill } from '@/components/atoms'
import type { PublicWork } from '@/types'

const ACTION_LABEL: Record<PublicWork['kind'], string> = {
  lab: 'View lab',
  student: 'View portfolio',
  project: 'View project',
}

/** The one public-facing card. Labs, students, research projects and a
 *  student's own published work items all adapt into PublicWork and render
 *  here, so search results and the dashboard's public preview cannot drift. */
export function WorkCard({ work, onOpen }: { work: PublicWork; onOpen: () => void }) {
  const isPerson = work.kind === 'student'

  return (
    <button
      onClick={onOpen}
      className="group overflow-hidden rounded-xl border border-line bg-white text-left
        transition-all hover:border-line-strong hover:shadow-lg"
    >
      {work.image && (
        <div className="relative">
          <img
            src={work.image}
            alt={work.imageAlt ?? ''}
            className="h-40 w-full object-cover object-center transition-transform group-hover:scale-[1.02]"
          />
          {isPerson && (
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-navy/35 to-transparent" />
          )}
        </div>
      )}

      <div className={`p-6 ${isPerson ? 'pt-0' : ''}`}>
        {isPerson ? (
          <div className="relative -mt-6 flex items-end justify-between gap-3">
            <div className="rounded-lg border-4 border-white shadow-sm">
              <InitialsAvatar initials={work.initials} />
            </div>
            <div className="pb-1">
              <CardAction>{ACTION_LABEL[work.kind]}</CardAction>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <InitialsAvatar initials={work.initials} />
            <CardAction>{ACTION_LABEL[work.kind]}</CardAction>
          </div>
        )}

        <h3 className="mt-4 text-lg font-bold leading-snug text-ink">{work.name}</h3>
        <p className="mt-0.5 mb-3 text-sm text-ink-faint">{work.org}</p>

        <div className="mb-4 flex flex-wrap gap-1.5">
          {work.tags.map(tag => (
            <Pill key={tag} label={tag} dark />
          ))}
        </div>

        <p className="mb-3 text-sm leading-relaxed text-ink-soft">{work.desc}</p>

        {work.details.length > 0 && (
          <ul className="mb-4 space-y-1">
            {work.details.map(detail => (
              <li key={detail} className="flex items-start gap-2 text-sm text-ink-soft">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                {detail}
              </li>
            ))}
          </ul>
        )}

        {work.tech.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-surface-muted pt-3">
            {work.tech.map(tool => (
              <Pill key={tool} label={tool} />
            ))}
          </div>
        )}
      </div>
    </button>
  )
}
