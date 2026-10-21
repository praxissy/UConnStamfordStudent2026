import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { INITIAL_WORK_ITEMS } from '@/data/workItems'
import type { WorkItem } from '@/types'

/** Work items are edited on the dashboard and read by the public preview, so
 *  they live above the routes rather than inside any one page.
 *
 *  `loggedIn` is the business-partner gate on the public search side. It is a
 *  prototype flag, not authentication. */
interface PortfolioContextValue {
  workItems: WorkItem[]
  saveWorkItem: (item: WorkItem) => void
  findWorkItem: (id: string) => WorkItem | undefined
  loggedIn: boolean
  setLoggedIn: (value: boolean) => void
}

const PortfolioContext = createContext<PortfolioContextValue | null>(null)

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [workItems, setWorkItems] = useState<WorkItem[]>(INITIAL_WORK_ITEMS)
  const [loggedIn, setLoggedIn] = useState(false)

  const saveWorkItem = useCallback((item: WorkItem) => {
    setWorkItems(current => {
      const exists = current.some(entry => entry.id === item.id)
      return exists ? current.map(entry => (entry.id === item.id ? item : entry)) : [...current, item]
    })
  }, [])

  const findWorkItem = useCallback(
    (id: string) => workItems.find(entry => entry.id === id),
    [workItems],
  )

  const value = useMemo(
    () => ({ workItems, saveWorkItem, findWorkItem, loggedIn, setLoggedIn }),
    [workItems, saveWorkItem, findWorkItem, loggedIn],
  )

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>
}

export function usePortfolio(): PortfolioContextValue {
  const value = useContext(PortfolioContext)
  if (!value) throw new Error('usePortfolio must be used inside a PortfolioProvider')
  return value
}
