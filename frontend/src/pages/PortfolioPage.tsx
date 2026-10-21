import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Select, TextInput } from '@/components/atoms'
import { EyeIcon, SearchIcon } from '@/components/atoms/icons'
import { WorkItemCard } from '@/components/molecules'
import { WorkItemDetailsModal } from '@/components/organisms'
import { DashboardLayout } from '@/components/templates'
import { workItemStartTime } from '@/lib/dates'
import { usePortfolio } from '@/state/PortfolioContext'
import type { WorkItem } from '@/types'

type SortOption = 'newest' | 'oldest' | 'approved' | 'pending' | 'category'

export function PortfolioPage() {
  const navigate = useNavigate()
  const { workItems } = usePortfolio()

  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [viewing, setViewing] = useState<WorkItem | null>(null)

  const stats = [
    { label: 'Accepted', value: workItems.filter(i => i.status === 'Approved').length, color: 'text-emerald-600' },
    { label: 'Declined', value: workItems.filter(i => i.status === 'Changes Requested').length, color: 'text-red-600' },
    { label: 'Under Review', value: workItems.filter(i => i.status === 'Under Review').length, color: 'text-amber-600' },
    { label: 'Drafts', value: workItems.filter(i => i.status === 'Draft').length, color: 'text-slate-500' },
  ]

  const query = search.trim().toLowerCase()
  const visible = workItems
    .filter(item => {
      const haystack = [
        item.title, item.category, item.description,
        item.university, item.parentProject, item.status, ...item.skills,
      ].join(' ').toLowerCase()

      const matchesSearch = query === '' || haystack.includes(query)
      const matchesFilter =
        sort === 'approved'
          ? item.status === 'Approved'
          : sort === 'pending'
            ? item.status === 'Under Review' || item.status === 'Changes Requested'
            : true

      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      if (sort === 'oldest') return workItemStartTime(a.dateRange) - workItemStartTime(b.dateRange)
      if (sort === 'newest') return workItemStartTime(b.dateRange) - workItemStartTime(a.dateRange)
      if (sort === 'category') return a.category.localeCompare(b.category) || a.title.localeCompare(b.title)
      return 0
    })

  const showAddCard = query === '' && sort !== 'approved' && sort !== 'pending'

  return (
    <DashboardLayout breadcrumbs={['Student Dashboard', 'Portfolio']}>
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-ink">My Portfolio</h1>
        <p className="text-sm text-ink-faint">
          Manage your academic and research work items. Accepted work items are visible on your public profile.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
        {stats.map(stat => (
          <div key={stat.label} className="rounded-xl border border-line bg-white px-5 py-4">
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <div className="mt-0.5 text-xs text-ink-faint">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="mb-7 flex flex-col gap-3 rounded-xl border border-line bg-white p-4 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-ghost" />
          <TextInput
            type="search"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search by title, category, skill, or keyword"
            aria-label="Search portfolio work items"
            className="pl-10"
          />
        </div>

        <Select
          value={sort}
          onChange={event => setSort(event.target.value as SortOption)}
          aria-label="Sort or filter portfolio work items"
          className="lg:w-40"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="approved">Accepted</option>
          <option value="pending">Pending</option>
          <option value="category">Category</option>
        </Select>

        <div className="flex flex-col gap-2 sm:flex-row lg:shrink-0">
          <Button variant="outline" onClick={() => navigate('/preview')}>
            <EyeIcon className="h-4 w-4" />
            View as Public
          </Button>
          <Button variant="primary" onClick={() => navigate('/dashboard/new')}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Work Item
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {visible.map(item => (
          <WorkItemCard
            key={item.id}
            item={item}
            onView={() => setViewing(item)}
            onEdit={() => navigate(`/dashboard/${item.id}/edit`)}
          />
        ))}

        {showAddCard && (
          <button
            onClick={() => navigate('/dashboard/new')}
            className="flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-xl
              border-2 border-dashed border-line p-6 text-ink-ghost transition-colors
              hover:border-gold hover:text-gold"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-current">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </span>
            <span className="text-sm font-medium">Add New Work Item</span>
          </button>
        )}

        {visible.length === 0 && (
          <div className="col-span-full rounded-xl border border-line bg-white px-6 py-10 text-center">
            <div className="text-sm font-semibold text-ink">No matching work items</div>
            <p className="mt-1 text-xs text-ink-faint">Try a different search term or filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setSort('newest')
              }}
              className="mt-3 text-xs font-medium text-gold hover:text-gold-deep"
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>

      {viewing && <WorkItemDetailsModal item={viewing} onClose={() => setViewing(null)} />}
    </DashboardLayout>
  )
}
