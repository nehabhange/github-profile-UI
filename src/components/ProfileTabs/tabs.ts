import type { LucideIcon } from 'lucide-react'
import { Book, BookOpen, Package, Star, Table } from 'lucide-react'

export type ProfileTab = 'overview' | 'repositories' | 'projects' | 'packages' | 'stars'

export interface TabDefinition {
  id: ProfileTab
  label: string
  icon: LucideIcon
  /** GitHub tab query used for tabs that should open the live profile. */
  githubTab?: string
}

export const PROFILE_TABS: TabDefinition[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'repositories', label: 'Repositories', icon: Book },
  { id: 'projects', label: 'Projects', icon: Table, githubTab: 'projects' },
  { id: 'packages', label: 'Packages', icon: Package, githubTab: 'packages' },
  { id: 'stars', label: 'Stars', icon: Star, githubTab: 'stars' },
]
