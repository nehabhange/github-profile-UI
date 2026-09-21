import { GitHubApiError, type GitHubUser } from '../types/github'

const API_BASE = 'https://api.github.com'

/**
 * Thin fetch wrapper around the GitHub REST API. Presentational components
 * never call `fetch` directly — they go through hooks in `src/hooks`, which
 * in turn go through this service.
 */
async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    signal,
    headers: {
      Accept: 'application/vnd.github+json',
    },
  })

  if (!response.ok) {
    const message = await describeError(response)
    throw new GitHubApiError(message, response.status)
  }

  return (await response.json()) as T
}

async function describeError(response: Response): Promise<string> {
  if (response.status === 404) {
    return 'GitHub user not found.'
  }

  if (response.status === 403) {
    const remaining = response.headers.get('x-ratelimit-remaining')
    if (remaining === '0') {
      return 'GitHub API rate limit exceeded. Please try again later.'
    }
    return 'Access to the GitHub API was forbidden.'
  }

  // Fall back to whatever GitHub sent back, if anything useful.
  try {
    const body = (await response.json()) as { message?: string }
    if (body.message) return body.message
  } catch {
    // response had no JSON body — ignore and use the generic message below.
  }

  return `GitHub API request failed with status ${response.status}.`
}

export function getUser(username: string, signal?: AbortSignal): Promise<GitHubUser> {
  return request<GitHubUser>(`/users/${encodeURIComponent(username)}`, signal)
}
