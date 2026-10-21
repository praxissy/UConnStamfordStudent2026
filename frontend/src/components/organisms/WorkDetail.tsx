import { InitialsAvatar, Pill } from '@/components/atoms'
import { ArrowLeftIcon, ArrowUpRightIcon } from '@/components/atoms/icons'
import type { PublicWork } from '@/types'

const KIND_LABEL: Record<PublicWork['kind'], string> = {
  lab: 'University lab',
  student: 'Researcher profile',
  project: 'Research project',
}

const LINK_LABEL: Record<string, string> = {
  github: 'View GitHub repository',
  website: 'Visit project website',
  docs: 'Read documentation',
}

/** The one public detail view. Shared by the public search result pages and a
 *  student's own preview of their published work. */
export function WorkDetail({ work, onBack, backLabel = 'Back to search results' }: {
  work: PublicWork
  onBack: () => void
  backLabel?: string
}) {
  const detailHeading = work.kind === 'lab' ? 'Capabilities' : 'Highlights'
  const links = Object.entries(work.links).filter(([, href]) => Boolean(href)) as [string, string][]

  return (
    <main className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-6 md:px-6 md:py-10">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          {backLabel}
        </button>

        <article className="overflow-hidden rounded-2xl border border-line bg-white">
          {work.image && (
            <img src={work.image} alt={work.imageAlt ?? ''} className="h-56 w-full object-cover md:h-80" />
          )}

          <div className="p-6 md:p-10">
            <div className="max-w-3xl">
              <div className="mb-5 flex items-center gap-4">
                <InitialsAvatar initials={work.initials} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gold">
                    {KIND_LABEL[work.kind]}
                  </p>
                  <p className="text-sm text-ink-faint">{work.org}</p>
                </div>
              </div>

              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-5xl">
                {work.name}
              </h1>

              <div className="mt-5 flex flex-wrap gap-2">
                {work.tags.map(tag => (
                  <Pill key={tag} label={tag} dark />
                ))}
              </div>
            </div>

            <div className="mt-10 grid gap-10 border-t border-line pt-10 md:grid-cols-[1fr_18rem]">
              <div>
                <h2 className="mb-3 text-xl font-bold text-ink">Overview</h2>
                <p className="text-base leading-7 text-ink-muted">{work.desc}</p>

                {work.details.length > 0 && (
                  <>
                    <h2 className="mb-4 mt-8 text-xl font-bold text-ink">{detailHeading}</h2>
                    <ul className="space-y-3">
                      {work.details.map(detail => (
                        <li key={detail} className="flex gap-3 text-sm text-ink-soft">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <aside className="h-fit rounded-xl bg-surface-soft p-5">
                <h2 className="mb-3 text-sm font-bold text-ink">Tools &amp; technologies</h2>
                <div className="flex flex-wrap gap-2">
                  {work.tech.map(tool => (
                    <Pill key={tool} label={tool} />
                  ))}
                </div>

                {links.map(([key, href]) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border
                      border-line-strong py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-white"
                  >
                    {LINK_LABEL[key] ?? key}
                    <ArrowUpRightIcon className="h-3.5 w-3.5" />
                  </a>
                ))}

                <p className="mt-5 border-t border-line pt-5 text-xs text-ink-faint">
                  Profile information is synced with the university portfolio database.
                </p>
              </aside>
            </div>
          </div>
        </article>
      </div>
    </main>
  )
}
