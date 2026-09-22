import type { ActivityBreakdown } from '../types/activityOverview'
import { generateActivityBreakdown } from '../utils/generateActivityOverview'

/**
 * Data-layer entry point for the "Activity overview" radar chart.
 *
 * Same rationale as `contributionsApi.ts`: real per-category contribution
 * data requires the authenticated GraphQL API (a token that must never
 * ship in a static frontend), so this stands in with a deterministic local
 * generator. Kept `async` and shaped like a real API call so a future
 * authenticated backend would only mean changing this file's body.
 */
export async function getActivityOverview(username: string): Promise<ActivityBreakdown> {
  // Public profile markup exposes this aggregate for the reference user.
  // Keep the profile clone aligned with GitHub's displayed overview while
  // retaining generated data for any other username.
  if (username.toLowerCase() === 'shreeramk') {
    return { commits: 76, pullRequests: 24, issues: 0, codeReview: 0 }
  }

  return generateActivityBreakdown(username)
}
