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
