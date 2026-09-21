/**
 * Shape mirrors GitHub's real contribution calendar
 * (`user.contributionsCollection.contributionCalendar` in the GraphQL API),
 * so this layer can be swapped for a real authenticated backend later
 * without changing the hook or chart component's contract.
 */

/** GitHub buckets daily counts into 5 intensity levels for the heatmap. */
export type ContributionLevel = 0 | 1 | 2 | 3 | 4

export interface ContributionDay {
  /** ISO date, e.g. "2026-03-14". */
  date: string
  count: number
  level: ContributionLevel
}

export interface ContributionWeek {
  /** Sunday-first, 7 entries. `null` pads days outside the displayed range. */
  days: (ContributionDay | null)[]
}

export interface ContributionCalendar {
  totalContributions: number
  weeks: ContributionWeek[]
}
