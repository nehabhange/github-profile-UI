import type { ContributionCalendar, ContributionDay, ContributionLevel, ContributionWeek } from '../types/contributions'
import { hashString, mulberry32 } from './random'

const DAYS_IN_RANGE = 371 // ~53 weeks, matching GitHub's own calendar span
const MS_PER_DAY = 24 * 60 * 60 * 1000

/**
 * Formats a date as YYYY-MM-DD using its *local* components. `toISOString()`
 * converts to UTC first, which silently shifts the date by a day in any
 * timezone ahead of UTC (e.g. IST) — this keeps "today" meaning today.
 */
function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Buckets raw counts into GitHub's 5 heatmap levels using the data's own quartiles. */
function assignLevels(counts: number[]): ContributionLevel[] {
  const nonZero = counts.filter((count) => count > 0).sort((a, b) => a - b)

  if (nonZero.length === 0) {
    return counts.map(() => 0)
  }

  const quantile = (p: number) => nonZero[Math.min(nonZero.length - 1, Math.floor(p * nonZero.length))]
  const q25 = quantile(0.25)
  const q50 = quantile(0.5)
  const q75 = quantile(0.75)

  return counts.map((count): ContributionLevel => {
    if (count === 0) return 0
    if (count <= q25) return 1
    if (count <= q50) return 2
    if (count <= q75) return 3
    return 4
  })
}

/**
 * Generates a deterministic, GitHub-shaped daily contribution calendar for
 * `username`, covering the last ~year ending today.
 *
 * This is a stand-in for authenticated GraphQL contribution data (see
 * Phase 6 write-up) — it never calls the network and holds no credentials.
 */
export function generateContributionCalendar(username: string): ContributionCalendar {
  const random = mulberry32(hashString(username) || 1)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const rangeStart = new Date(today.getTime() - (DAYS_IN_RANGE - 1) * MS_PER_DAY)
  // Align the grid to a Sunday-first week, like GitHub's calendar.
  const gridStart = new Date(rangeStart.getTime() - rangeStart.getDay() * MS_PER_DAY)

  const dayEntries: (ContributionDay | null)[] = []
  const rawCounts: number[] = []

  for (let cursor = new Date(gridStart); cursor <= today; cursor = new Date(cursor.getTime() + MS_PER_DAY)) {
    if (cursor < rangeStart) {
      dayEntries.push(null)
      continue
    }

    const isWeekend = cursor.getDay() === 0 || cursor.getDay() === 6
    const isActive = random() < (isWeekend ? 0.35 : 0.72)
    // Occasional high-activity bursts, otherwise a modest day.
    const count = isActive ? Math.round(random() * (random() < 0.12 ? 18 : 6)) : 0

    rawCounts.push(count)
    dayEntries.push({ date: toIsoDate(cursor), count, level: 0 })
  }

  const levels = assignLevels(rawCounts)
  let levelIndex = 0
  const finalized = dayEntries.map((day) => {
    if (day === null) return null
    const level = levels[levelIndex]
    levelIndex += 1
    return { ...day, level }
  })

  const weeks: ContributionWeek[] = []
  for (let i = 0; i < finalized.length; i += 7) {
    weeks.push({ days: finalized.slice(i, i + 7) })
  }

  const totalContributions = rawCounts.reduce((sum, count) => sum + count, 0)

  return { totalContributions, weeks }
}
