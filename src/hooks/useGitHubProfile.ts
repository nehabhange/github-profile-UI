import { useEffect, useState } from 'react'
import { getUser } from '../services/githubApi'
import { GitHubApiError, type GitHubUser } from '../types/github'

type ProfileState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: GitHubUser; error: null }
  | { status: 'error'; data: null; error: string }

const LOADING_STATE: ProfileState = { status: 'loading', data: null, error: null }

/**
 * Fetches a GitHub user's public profile and exposes loading/error/success
 * state. Re-fetches whenever `username` changes and aborts any in-flight
 * request on unmount to avoid setting state on an unmounted component.
 */
export function useGitHubProfile(username: string): ProfileState {
  const [state, setState] = useState<ProfileState>(LOADING_STATE)

  // Reset to "loading" during render when `username` changes, following
  // React's guidance for adjusting state in response to a prop change,
  // rather than calling setState synchronously inside the effect below.
  const [trackedUsername, setTrackedUsername] = useState(username)
  if (username !== trackedUsername) {
    setTrackedUsername(username)
    setState(LOADING_STATE)
  }

  useEffect(() => {
    const controller = new AbortController()

    getUser(username, controller.signal)
      .then((data) => setState({ status: 'success', data, error: null }))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return

        const message =
          error instanceof GitHubApiError
            ? error.message
            : 'Something went wrong while loading this profile.'
        setState({ status: 'error', data: null, error: message })
      })

    return () => controller.abort()
  }, [username])

  return state
}
