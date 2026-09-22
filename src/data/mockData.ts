import type { LucideIcon } from 'lucide-react'
import { Award, Rocket, Sparkles, Users2 } from 'lucide-react'

/**
 * GitHub's profile "Achievements" section is populated from private,
 * account-level activity (pull request counts, streaks, etc.) that has no
 * public API. The assignment explicitly allows mock data here — this is a
 * representative, not literal, set of badges.
 */
export interface Achievement {
  id: string
  label: string
  icon: LucideIcon
  color: string
}

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'pull-shark', label: 'Pull Shark', icon: Sparkles, color: '#218bff' },
  { id: 'pair-extraordinaire', label: 'Pair Extraordinaire', icon: Users2, color: '#8250df' },
  { id: 'quickdraw', label: 'Quickdraw', icon: Rocket, color: '#bf3989' },
  { id: 'starstruck', label: 'Starstruck', icon: Award, color: '#9a6700' },
]

/**
 * GitHub's public REST API does not expose which organizations a user
 * belongs to without extra scoped requests, and org membership is often
 * private. Mocked here per the assignment; the primary organization name
 * mirrors the real profile's "company" field for visual consistency.
 */
export interface Organization {
  id: string
  name: string
  url: string
  initial: string
  color: string
}

export const MOCK_ORGANIZATIONS: Organization[] = [
  { id: 'uptimeai', name: 'UptimeAI', url: 'https://github.com/uptimeai', initial: 'U', color: '#0969da' },
]

/**
 * GitHub's "Contribution activity" timeline is assembled from private
 * event data (commit contents, PR/review metadata) with no public,
 * unauthenticated equivalent. Mocked per the assignment; `monthsAgo` is
 * relative to today so the timeline always reads as current instead of
 * drifting to a fixed past date.
 */
export type ActivityType = 'commit' | 'pull-request' | 'review' | 'repository' | 'private'

export interface ActivityEvent {
  id: string
  type: ActivityType
  summary: string
  repositories: string[]
  monthsAgo: number
  /** Only for `type: 'private'` — contribution count in private repos this month. */
  privateCount?: number
}

export const MOCK_ACTIVITY: ActivityEvent[] = [
  // The real page shows a locked "N contributions in private repositories"
  // row for the current month, with a date range next to it — see
  // ContributionActivity.tsx, which computes that range live rather than
  // storing a date that would go stale.
  {
    id: 'act-private',
    type: 'private',
    summary: '17 contributions in private repositories',
    repositories: [],
    monthsAgo: 0,
    privateCount: 17,
  },
  {
    id: 'act-1',
    type: 'pull-request',
    summary: 'Opened 3 pull requests in 2 repositories',
    repositories: ['node-opcua-1', 'kafkajs'],
    monthsAgo: 0,
  },
  {
    id: 'act-2',
    type: 'commit',
    summary: 'Created 14 commits in 3 repositories',
    repositories: ['TitaniumAS.Opc.Client', 'Catch2', 'node-opcua-1'],
    monthsAgo: 0,
  },
  {
    id: 'act-3',
    type: 'repository',
    summary: 'Created 1 repository',
    repositories: ['gitignore'],
    monthsAgo: 1,
  },
  {
    id: 'act-4',
    type: 'review',
    summary: 'Reviewed 2 pull requests in 1 repository',
    repositories: ['kafkajs'],
    monthsAgo: 1,
  },
  {
    id: 'act-5',
    type: 'commit',
    summary: 'Created 8 commits in 2 repositories',
    repositories: ['Catch2', 'flutter_login_ui'],
    monthsAgo: 2,
  },
  {
    id: 'act-6',
    type: 'pull-request',
    summary: 'Opened 1 pull request in 1 repository',
    repositories: ['Complete-Python-3-Bootcamp'],
    monthsAgo: 3,
  },
]

/**
 * Two additional, older months revealed only via the "Show more activity"
 * button (matches the real page's progressive-disclosure pattern).
 */
export const MOCK_ACTIVITY_MORE: ActivityEvent[] = [
  {
    id: 'act-7',
    type: 'commit',
    summary: 'Created 5 commits in 1 repository',
    repositories: ['node-opcua-logger'],
    monthsAgo: 4,
  },
  {
    id: 'act-8',
    type: 'repository',
    summary: 'Created 1 repository',
    repositories: ['flutter_login_ui'],
    monthsAgo: 5,
  },
]
