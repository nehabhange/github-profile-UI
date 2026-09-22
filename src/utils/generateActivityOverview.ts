import type { ActivityBreakdown } from '../types/activityOverview'
import { hashString, mulberry32 } from './random'

const CATEGORIES: (keyof ActivityBreakdown)[] = ['commits', 'issues', 'pullRequests', 'codeReview']

// Rough real-world skew: most contributors' activity leans heavily toward
// commits, with issues and code review trailing — used as relative weights
// so the generated split reads like a plausible engineer, not pure noise.
const BASE_WEIGHTS: Record<keyof ActivityBreakdown, number> = {
  commits: 6,
  pullRequests: 3,
  issues: 1,
  codeReview: 1,
}

/**
 * Generates a deterministic contribution-type breakdown (percentages
 * summing to 100) for GitHub's "Activity overview" radar chart.
 *
 * Real per-category contribution counts only exist behind the
 * authenticated GraphQL API (`contributionsCollection`), which requires a
 * Personal Access Token — the same constraint documented for the
 * contribution calendar (see generateContributions.ts / the Phase 6
 * write-up). This never calls the network and holds no credentials.
 *
 * Seeded independently from the calendar's seed (different suffix) so the
 * two generated datasets don't visibly correlate.
 */
export function generateActivityBreakdown(username: string): ActivityBreakdown {
  const random = mulberry32(hashString(`${username}:activity`) || 1)

  const rawScores = CATEGORIES.map((category) => BASE_WEIGHTS[category] * (0.5 + random()))
  const total = rawScores.reduce((sum, score) => sum + score, 0)

  // Round to whole percentages while keeping the total exactly 100
  // (largest-remainder method), so the radar's labels always add up.
  const rawPercentages = rawScores.map((score) => (score / total) * 100)
  const flooredPercentages = rawPercentages.map(Math.floor)
  let remainder = 100 - flooredPercentages.reduce((sum, value) => sum + value, 0)

  const remainderOrder = rawPercentages
    .map((value, index) => ({ index, fraction: value - flooredPercentages[index] }))
    .sort((a, b) => b.fraction - a.fraction)

  const finalPercentages = [...flooredPercentages]
  for (const { index } of remainderOrder) {
    if (remainder <= 0) break
    finalPercentages[index] += 1
    remainder -= 1
  }

  const result = {} as ActivityBreakdown
  CATEGORIES.forEach((category, index) => {
    result[category] = finalPercentages[index]
  })
  return result
}
