import { GitHubApiError, type GitHubRepository, type GitHubUser } from '../types/github'

const API_BASE = 'https://api.github.com'
const CACHE_TTL_MS = 60_000

/**
 * A tiny in-memory cache, keyed by request path, shared by every caller of
 * `request()`. Two reasons for this rather than fetching fresh every time:
 *
 * 1. Several components independently call the same hook for the same data
 *    (e.g. `PopularRepositories` and `ActivityOverview` both call
 *    `useGitHubRepositories`), so a single page load can otherwise issue
 *    the same GET twice — this de-dupes that.
 * 2. GitHub's unauthenticated REST API rate-limits at 60 requests/hour per
 *    IP. This cache is the safe way to reduce request volume — the unsafe
 *    way would be shipping a Personal Access Token in this frontend, which
 *    Vite would bake into the built JS bundle as a plain, extractable
 *    string. That's the exact anti-pattern this project's contribution
 *    data investigation (see README) ruled out, so it's not done here
 *    either, including for local testing.
 *
 * Deliberately simple: no persistence, no invalidation UI, just a short
 * TTL. Failed requests are never cached, so a transient error doesn't get
 * "stuck" — the next call retries against the network.
 */
const cache = new Map<string, { promise: Promise<unknown>; expiresAt: number }>()

/**
 * Thin fetch wrapper around the GitHub REST API. Presentational components
 * never call `fetch` directly — they go through hooks in `src/hooks`, which
 * in turn go through this service.
 *
 * Note on `signal`: a cache entry can be shared by multiple independent
 * callers (see the cache doc comment above). It is deliberately NOT wired
 * into the underlying `fetch()`, because an `AbortSignal` belongs to one
 * caller's lifecycle — if caller A unmounts and aborts while caller B is
 * still waiting on that same shared promise, tying the fetch to A's signal
 * would cancel B's data too. `signal` stays part of this function's
 * contract (callers still pass it, and hooks still use it to ignore stale
 * results after unmount), it just isn't forwarded to the network call.
 */
function request<T>(path: string, _signal?: AbortSignal): Promise<T> {
  const cached = cache.get(path)
  if (cached && cached.expiresAt > Date.now()) {
    return cached.promise as Promise<T>
  }

  const promise = performRequest<T>(path)
  // Cache the in-flight promise immediately (not just the resolved value)
  // so concurrent callers within the same tick share one fetch.
  cache.set(path, { promise, expiresAt: Date.now() + CACHE_TTL_MS })

  promise.catch(() => {
    // Don't let a failed request poison the cache for the next attempt.
    if (cache.get(path)?.promise === promise) cache.delete(path)
  })

  return promise
}

async function performRequest<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
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

export function getRepositories(
  username: string,
  signal?: AbortSignal,
): Promise<GitHubRepository[]> {
  return request<GitHubRepository[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    signal,
  )
}

interface RepositoryDetail {
  parent: { full_name: string; html_url: string } | null
}

/**
 * `GET /repos/{full_name}` — used only to read `parent` for forks, since
 * the list endpoint (`getRepositories`) doesn't include it.
 */
export function getRepositoryDetail(
  fullName: string,
  signal?: AbortSignal,
): Promise<RepositoryDetail> {
  return request<RepositoryDetail>(`/repos/${fullName}`, signal)
}
