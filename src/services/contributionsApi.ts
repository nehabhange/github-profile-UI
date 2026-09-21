import type { ContributionCalendar } from '../types/contributions'
import { generateContributionCalendar } from '../utils/generateContributions'

/**
 * Data-layer entry point for the contribution calendar.
 *
 * GitHub only exposes real per-day contribution counts through the
 * authenticated GraphQL API, which requires a Personal Access Token that
 * must never be shipped to the browser (see the Phase 6 write-up). This
 * function stands in for that call with a deterministic local generator.
 *
 * It is `async` and shaped exactly like `githubApi.ts`'s functions
 * (username in, typed data out, network-shaped errors) so that swapping in
 * a real authenticated backend later only means changing this file's body —
 * the hook and the chart component would not need to change.
 */
export async function getContributionCalendar(username: string): Promise<ContributionCalendar> {
  return generateContributionCalendar(username)
}
