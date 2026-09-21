/** Formats an ISO date string the way GitHub does: "Joined Jan 2015". */
export function formatJoinDate(isoDate: string): string {
  const date = new Date(isoDate)
  const formatted = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  return `Joined ${formatted}`
}

/** GitHub's `blog` field is often a bare domain (e.g. "example.com"). */
export function normalizeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

/** Strips the protocol for display, mirroring how GitHub shows the link text. */
export function displayUrl(url: string): string {
  return url.replace(/^https?:\/\//i, '').replace(/\/$/, '')
}

/**
 * Formats a "YYYY-MM-DD" string as "Mar 14, 2026" for chart tooltips.
 * Parses the parts manually rather than `new Date(isoDate)`, which treats a
 * bare date string as UTC midnight and can display a day off in timezones
 * ahead of UTC.
 */
export function formatShortDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
