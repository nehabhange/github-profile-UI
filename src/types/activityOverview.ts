/**
 * Mirrors GitHub's real "Activity overview" radar chart: a breakdown of
 * contribution types as percentages of total activity (sums to 100).
 */
export interface ActivityBreakdown {
  commits: number
  issues: number
  pullRequests: number
  codeReview: number
}
