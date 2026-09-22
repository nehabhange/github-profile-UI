import type { ContributionCalendar, ContributionDay, ContributionLevel, ContributionWeek } from '../types/contributions'

/**
 * GitHub's public contribution markup for @shreeramk, captured on 2026-09-22.
 *
 * The public REST API does not expose the per-day calendar data. This compact
 * snapshot keeps the rendered profile faithful to the supplied reference
 * without putting a credential in the browser. Each entry is `level.count`,
 * with the count encoded in base 36.
 */
const SNAPSHOT_START = '2025-09-21'
const SNAPSHOT_TOTAL = 2046
const SNAPSHOT_DAYS = `0.0 0.0 1.2 0.0 0.0 0.0 0.0 1.1 0.0 0.0 0.0 2.c 1.6 0.0 0.0 1.1 1.1 1.1 0.0 0.0 1.2 1.1 0.0 0.0 1.6 0.0 1.3 1.5 0.0 0.0 0.0 1.3 0.0 1.2 0.0 0.0 1.6 0.0 0.0 1.3 1.3 1.3 1.3 1.4 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0 1.7 0.0 1.2 1.1 0.0 1.1 1.3 2.d 1.5 1.1 1.5 1.8 1.3 1.7 2.b 2.b 1.1 1.2 0.0 0.0 0.0 1.5 1.3 2.c 1.1 0.0 2.a 1.4 1.4 3.l 1.3 1.3 4.r 1.6 1.2 1.7 2.b 1.5 0.0 3.i 2.e 1.3 3.l 2.a 2.9 0.0 3.l 0.0 1.1 1.2 1.1 1.2 1.1 2.a 0.0 2.a 1.1 1.1 2.g 3.m 4.11 0.0 1.2 2.g 2.a 2.d 1.8 1.6 1.7 1.1 2.a 0.0 0.0 1.1 1.2 1.6 4.q 2.e 3.h 1.6 1.3 0.0 2.a 2.c 0.0 3.k 1.4 0.0 4.z 1.2 1.3 1.8 3.h 1.3 0.0 3.j 2.d 1.3 1.6 2.e 0.0 1.4 0.0 0.0 1.4 1.1 1.1 1.2 2.e 1.1 1.1 2.g 1.1 1.5 1.6 1.6 2.b 4.p 3.j 1.6 1.3 2.f 0.0 2.c 0.0 1.1 1.2 1.7 1.5 4.w 1.4 2.a 1.1 2.e 3.n 2.g 1.3 1.5 3.l 1.6 0.0 0.0 2.b 2.9 1.3 2.a 1.6 1.1 2.d 3.i 3.h 0.0 1.1 0.0 1.2 0.0 1.1 1.1 1.5 0.0 1.7 1.1 0.0 1.7 3.i 1.8 1.4 2.9 1.4 3.j 3.o 1.1 0.0 1.8 1.6 1.1 0.0 0.0 1.3 0.0 1.1 0.0 2.f 2.d 1.6 2.e 2.b 1.1 3.l 1.5 3.h 1.8 4.t 1.4 1.2 1.6 4.v 3.i 2.e 1.2 1.3 2.d 0.0 1.3 0.0 1.1 0.0 1.3 1.1 1.2 0.0 1.2 0.0 1.4 1.6 3.m 3.o 3.h 0.0 4.r 1.6 2.9 0.0 1.3 1.2 2.d 1.3 1.2 0.0 1.4 1.6 1.3 1.1 0.0 1.8 1.5 2.g 1.4 3.o 1.8 3.j 0.0 1.4 3.n 0.0 2.9 2.d 2.d 2.a 1.1 1.5 2.g 2.a 2.a 1.4 1.3 0.0 0.0 1.4 1.1 0.0 0.0 0.0 0.0 0.0 1.3 0.0 1.2 1.6 0.0 0.0 1.6 1.2 3.i 0.0 0.0 1.4 0.0 1.2 1.2 0.0 1.1 0.0 0.0 0.0 0.0 0.0 0.0 1.3 0.0 1.1 1.2 2.a 0.0 1.2 2.b 0.0 2.9 1.2 1.6 1.7 2.g 1.4 0.0 0.0 1.8 0.0 0.0 0.0 0.0 0.0 0.0 0.0 0.0`

function toIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getShreeramkContributionSnapshot(): ContributionCalendar {
  const start = new Date(`${SNAPSHOT_START}T00:00:00`)
  const days = SNAPSHOT_DAYS.split(' ').map((entry, index): ContributionDay => {
    const [rawLevel, rawCount] = entry.split('.')
    const date = new Date(start)
    date.setDate(start.getDate() + index)

    return {
      date: toIsoDate(date),
      level: Number(rawLevel) as ContributionLevel,
      count: Number.parseInt(rawCount, 36),
    }
  })

  const weeks: ContributionWeek[] = []
  for (let index = 0; index < days.length; index += 7) {
    weeks.push({ days: days.slice(index, index + 7) })
  }

  return { totalContributions: SNAPSHOT_TOTAL, weeks }
}
