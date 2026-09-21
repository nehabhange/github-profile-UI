import type { ActivityEvent } from '../data/mockData'

export interface ActivityMonthGroup {
  label: string
  events: ActivityEvent[]
}

/** Groups activity events by their relative month and labels each group, e.g. "September 2026". */
export function groupActivityByMonth(
  events: ActivityEvent[],
  referenceDate = new Date(),
): ActivityMonthGroup[] {
  const groups = new Map<number, ActivityEvent[]>()

  for (const event of events) {
    const existing = groups.get(event.monthsAgo)
    if (existing) {
      existing.push(event)
    } else {
      groups.set(event.monthsAgo, [event])
    }
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a - b)
    .map(([monthsAgo, monthEvents]) => {
      const date = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - monthsAgo, 1)
      return {
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
        events: monthEvents,
      }
    })
}
