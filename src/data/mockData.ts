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
