import { useEffect, useState } from 'react'
import { getActivityOverview } from '../services/activityOverviewApi'
import type { ActivityBreakdown } from '../types/activityOverview'

type ActivityOverviewState =
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: ActivityBreakdown; error: null }
  | { status: 'error'; data: null; error: string }

const LOADING_STATE: ActivityOverviewState = { status: 'loading', data: null, error: null }

/**
 * Loads the contribution-type breakdown for the "Activity overview" radar
 * chart. Same loading/success/error contract as the other data hooks — see
 * `useContributionCalendar.ts` for the identical reasoning.
 */
export function useActivityOverview(username: string): ActivityOverviewState {
  const [state, setState] = useState<ActivityOverviewState>(LOADING_STATE)

  const [trackedUsername, setTrackedUsername] = useState(username)
  if (username !== trackedUsername) {
    setTrackedUsername(username)
    setState(LOADING_STATE)
  }

  useEffect(() => {
    let cancelled = false

    getActivityOverview(username)
      .then((data) => {
        if (!cancelled) setState({ status: 'success', data, error: null })
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            status: 'error',
            data: null,
            error: 'Something went wrong while loading the activity overview.',
          })
        }
      })

    return () => {
      cancelled = true
    }
  }, [username])

  return state
}
