import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmptyState, } from '@/components/molecules'
import { WorkDetail } from '@/components/organisms'
import { PublicLayout } from '@/components/templates'
import { LABS } from '@/data/labs'
import { RESEARCH_PROJECTS } from '@/data/researchProjects'
import { STUDENTS } from '@/data/students'
import {
  labToPublicWork, researchProjectToPublicWork, studentToPublicWork, workItemToPublicWork,
} from '@/lib/publicWork'
import { usePortfolio } from '@/state/PortfolioContext'

/** Resolved by `public_slug`, the same way the real detail URL will be once
 *  this is reading from the database. */
export function PublicDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { workItems, loggedIn, setLoggedIn } = usePortfolio()

  const everything = useMemo(
    () => [
      ...LABS.map(labToPublicWork),
      ...STUDENTS.map(studentToPublicWork),
      ...RESEARCH_PROJECTS.map(researchProjectToPublicWork),
      ...workItems.filter(item => item.status === 'Approved').map(workItemToPublicWork),
    ],
    [workItems],
  )

  const work = everything.find(entry => entry.slug === slug)

  return (
    <PublicLayout
      loggedIn={loggedIn}
      onSignIn={() => navigate('/')}
      onSignOut={() => setLoggedIn(false)}
    >
      {work ? (
        <WorkDetail work={work} onBack={() => navigate('/')} />
      ) : (
        <div className="mx-auto max-w-2xl px-6 py-24">
          <EmptyState
            title="That page could not be found"
            body="The work item may have been unpublished, or the link is out of date."
          />
        </div>
      )}
    </PublicLayout>
  )
}
