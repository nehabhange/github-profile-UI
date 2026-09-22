import { useEffect, useState } from 'react'
import { getRepositories, getRepositoryDetail } from '../services/githubApi'
import { GitHubApiError, type PopularRepository } from '../types/github'
import { selectPopularRepositories } from '../utils/repositories'

type RepositoriesState =
  | { status: 'loading'; data: null; total: null; error: null }
  | { status: 'success'; data: PopularRepository[]; total: number; error: null }
  | { status: 'error'; data: null; total: null; error: string }

const LOADING_STATE: RepositoriesState = { status: 'loading', data: null, total: null, error: null }

/**
 * Best-effort enriches forked repos with their fork parent (`owner/repo`),
 * fetched one extra request per fork via `GET /repos/{full_name}` (the list
 * endpoint doesn't include `parent`). Bounded to the already-selected
 * popular subset (≤6), run in parallel, and never fails the whole section —
 * a repo whose detail call fails just falls back to the generic "Forked"
 * badge in RepositoryCard.
 */
async function withForkParents(
  repos: PopularRepository[],
  signal?: AbortSignal,
): Promise<PopularRepository[]> {
  const results = await Promise.allSettled(
    repos.map((repo) =>
      repo.fork ? getRepositoryDetail(repo.full_name, signal) : Promise.resolve(null),
    ),
  )

  return repos.map((repo, index) => {
    const result = results[index]
    if (result.status !== 'fulfilled' || !result.value?.parent) return repo
    return {
      ...repo,
      parentFullName: result.value.parent.full_name,
      parentUrl: result.value.parent.html_url,
    }
  })
}

/**
 * Fetches a GitHub user's repositories and returns a ready-to-render
 * "popular repositories" subset (plus the real total repo count, for
 * copy like "and N other repositories"). Follows the same loading/error
 * /success shape as `useGitHubProfile` for consistency.
 */
export function useGitHubRepositories(username: string): RepositoriesState {
  const [state, setState] = useState<RepositoriesState>(LOADING_STATE)

  const [trackedUsername, setTrackedUsername] = useState(username)
  if (username !== trackedUsername) {
    setTrackedUsername(username)
    setState(LOADING_STATE)
  }

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    getRepositories(username, controller.signal)
      .then(async (repos) => {
        const popular = selectPopularRepositories(repos)
        const enriched = await withForkParents(popular, controller.signal)
        if (!cancelled) {
          setState({ status: 'success', data: enriched, total: repos.length, error: null })
        }
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return
        if (cancelled) return

        const message =
          error instanceof GitHubApiError
            ? error.message
            : 'Something went wrong while loading repositories.'
        setState({ status: 'error', data: null, total: null, error: message })
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [username])

  return state
}
