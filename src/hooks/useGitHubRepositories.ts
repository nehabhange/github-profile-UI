import { useEffect, useState } from 'react'
import { getRepositories } from '../services/githubApi'
import { GitHubApiError, type GitHubRepository } from '../types/github'
import { selectPopularRepositories } from '../utils/repositories'

type RepositoriesState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: GitHubRepository[]; error: null }
  | { status: 'error'; data: null; error: string }

const LOADING_STATE: RepositoriesState = { status: 'loading', data: null, error: null }

/**
 * Fetches a GitHub user's repositories and returns a ready-to-render
 * "popular repositories" subset. Follows the same loading/error/success
 * shape as `useGitHubProfile` for consistency.
 */
export function useGitHubRepositories(username: string): RepositoriesState {
  const [state, setState] = useState<RepositoriesState>(LOADING_STATE)

  const [trackedUsername, setTrackedUsername] = useState(username)
  if (username !== trackedUsername) {
    setTrackedUsername(username)
    setState(LOADING_STATE)
  }

  useEffect(() => {
    const controller = new AbortController()

    getRepositories(username, controller.signal)
      .then((repos) =>
        setState({ status: 'success', data: selectPopularRepositories(repos), error: null }),
      )
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return

        const message =
          error instanceof GitHubApiError
            ? error.message
            : 'Something went wrong while loading repositories.'
        setState({ status: 'error', data: null, error: message })
      })

    return () => controller.abort()
  }, [username])

  return state
}
