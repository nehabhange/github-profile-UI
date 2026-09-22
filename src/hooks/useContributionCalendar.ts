import { useEffect, useState } from 'react'
import { getContributionCalendar } from '../services/contributionsApi'
import type { ContributionCalendar } from '../types/contributions'

type ContributionCalendarState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: ContributionCalendar; error: null }
  | { status: 'error'; data: null; error: string }

const LOADING_STATE: ContributionCalendarState = { status: 'loading', data: null, error: null }

/**
 * Loads the contribution calendar for `username`. Kept as a hook with the
 * same loading/success/error contract as the other GitHub data hooks, even
 * though the current data layer resolves synchronously — this is what lets
 * `contributionsApi.ts` be swapped for a real network call later without
 * touching this hook or the chart component that consumes it.
 */
export function useContributionCalendar(username: string): ContributionCalendarState {
  const [state, setState] = useState<ContributionCalendarState>(LOADING_STATE)

  const [trackedUsername, setTrackedUsername] = useState(username)
  if (username !== trackedUsername) {
    setTrackedUsername(username)
    setState(LOADING_STATE)
  }

  useEffect(() => {
    let cancelled = false

    getContributionCalendar(username)
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null })
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: 'error',
            data: null,
            error: 'Something went wrong while loading the contribution graph.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [username])

  return state
}
