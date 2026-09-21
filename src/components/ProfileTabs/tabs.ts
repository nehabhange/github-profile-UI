import type { LucideIcon } from 'lucide-react'
import { Book, BookOpen, Package, Table } from 'lucide-react'

export type ProfileTab = 'overview' | 'repositories' | 'projects' | 'packages'

export interface TabDefinition {
  id: ProfileTab
  label: string
  icon: LucideIcon
}

export const PROFILE_TABS: TabDefinition[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'repositories', label: 'Repositories', icon: Book },
  { id: 'projects', label: 'Projects', icon: Table },
  { id: 'packages', label: 'Packages', icon: Package },
]
