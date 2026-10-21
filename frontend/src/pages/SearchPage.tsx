import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GatePrompt, LoginModal, ResultsSection, SearchHero } from '@/components/organisms'
import { PublicLayout } from '@/components/templates'
import { AI_SUGGESTIONS_LABS, AI_SUGGESTIONS_STUDENTS } from '@/data/aiSuggestions'
import { LABS } from '@/data/labs'
import { RESEARCH_PROJECTS } from '@/data/researchProjects'
import { STUDENTS } from '@/data/students'
import {
  labToPublicWork, researchProjectToPublicWork, studentToPublicWork,
} from '@/lib/publicWork'
import { usePortfolio } from '@/state/PortfolioContext'
import type { Domain, PublicWork, ResultTab, SearchMode } from '@/types'

/** Everything in `work` that a free-text query should match. */
function matches(work: PublicWork, query: string): boolean {
  if (!query) return true
  const haystack = [work.name, work.org, ...work.tags, ...work.details, ...work.tech]
    .join(' ')
    .toLowerCase()
  return haystack.includes(query)
}

export function SearchPage() {
  const navigate = useNavigate()
  const { loggedIn, setLoggedIn } = usePortfolio()

  const [domain, setDomain] = useState<Domain>('labs')
  const [mode, setMode] = useState<SearchMode>('standard')
  const [query, setQuery] = useState('')
  const [aiQuery, setAiQuery] = useState('')
  const [tab, setTab] = useState<ResultTab>('labs')
  const [hasSearched, setHasSearched] = useState(false)
  const [showLogin, setShowLogin] = useState(false)

  const allLabs = useMemo(() => LABS.map(labToPublicWork), [])
  const allStudents = useMemo(() => STUDENTS.map(studentToPublicWork), [])
  const allProjects = useMemo(() => RESEARCH_PROJECTS.map(researchProjectToPublicWork), [])

  const normalized = query.trim().toLowerCase()
  const labs = allLabs.filter(work => matches(work, normalized))
  const students = allStudents.filter(work => matches(work, normalized))
  const projects = allProjects.filter(work => matches(work, normalized))

  function handleDomainSwitch(next: Domain) {
    if (next === 'students' && !loggedIn) {
      setShowLogin(true)
      return
    }
    setDomain(next)
    setTab(next === 'labs' ? 'labs' : 'students')
    setHasSearched(false)
    setQuery('')
    setAiQuery('')
  }

  function handleLogin() {
    setLoggedIn(true)
    setShowLogin(false)
    setDomain('students')
    setTab('students')
    setHasSearched(false)
  }

  function handleSignOut() {
    setLoggedIn(false)
    setDomain('labs')
    setTab('labs')
  }

  const isLabs = domain === 'labs'

  return (
    <PublicLayout loggedIn={loggedIn} onSignIn={() => setShowLogin(true)} onSignOut={handleSignOut}>
      <SearchHero
        domain={domain}
        loggedIn={loggedIn}
        mode={mode}
        query={query}
        aiQuery={aiQuery}
        suggestions={isLabs ? AI_SUGGESTIONS_LABS : AI_SUGGESTIONS_STUDENTS}
        title={isLabs ? 'Find a University Lab or Equipment' : 'Find a Student or Project'}
        subtitle={
          isLabs
            ? `Browse ${LABS.length} university labs across specializations.`
            : 'Browse student researchers and industry-partnered projects.'
        }
        searchPlaceholder={
          isLabs
            ? 'Search labs, universities, technologies…'
            : 'Search students, skills, programs, universities…'
        }
        aiPlaceholder={
          isLabs
            ? 'Describe what you need — equipment, project type, skills, industry, timeline…'
            : 'Describe the student or project you need — skills, industry, program level, availability…'
        }
        onDomainSwitch={handleDomainSwitch}
        onModeChange={setMode}
        onQueryChange={setQuery}
        onAiQueryChange={setAiQuery}
        onSearch={() => {
          setHasSearched(true)
          setTab(isLabs ? 'labs' : 'students')
        }}
      />

      <ResultsSection
        domain={domain}
        hasSearched={hasSearched}
        tab={tab}
        labs={labs}
        students={students}
        projects={projects}
        onTabChange={setTab}
        onOpen={work => navigate(`/item/${work.slug}`)}
      />

      {domain === 'students' && !loggedIn && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80">
          <GatePrompt onLoginClick={() => setShowLogin(true)} />
        </div>
      )}

      {showLogin && <LoginModal onLogin={handleLogin} onClose={() => setShowLogin(false)} />}
    </PublicLayout>
  )
}
