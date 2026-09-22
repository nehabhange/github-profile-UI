import { Fragment, useEffect, useRef, type ReactNode } from 'react'
import * as echarts from 'echarts/core'
import { RadarChart } from 'echarts/charts'
import { RadarComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { AlertTriangle, Book } from 'lucide-react'
import { useActivityOverview } from '../../hooks/useActivityOverview'
import { useGitHubRepositories } from '../../hooks/useGitHubRepositories'
import EmptyState from '../EmptyState/EmptyState'
import { buildContributedToSummary, type ContributedToSummary } from '../../utils/repositories'
import { buildActivityChartOption, readActivityChartTheme } from './chartOption'
import ActivityOverviewSkeleton from './ActivityOverviewSkeleton'
import styles from './ActivityOverview.module.css'

echarts.use([RadarChart, RadarComponent, TooltipComponent, CanvasRenderer])

interface ActivityOverviewProps {
  username: string
}

export default function ActivityOverview({ username }: ActivityOverviewProps) {
  const breakdown = useActivityOverview(username)
  // A second call to the repos endpoint (PopularRepositories already makes
  // one) — kept deliberately simple rather than lifting shared state into a
  // store, per the "avoid Redux/Zustand" constraint. Real repo names here
  // drive the "Contributed to..." line below.
  const repositories = useGitHubRepositories(username)

  const containerRef = useRef<HTMLDivElement>(null)

  const isLoading = breakdown.status === 'loading' || repositories.status === 'loading'
  const errorMessage =
    breakdown.status === 'error'
      ? breakdown.error
      : repositories.status === 'error'
        ? repositories.error
        : null
  // The chart <div> (and thus containerRef) only mounts once BOTH hooks
  // have resolved successfully (see the render branches below) — so the
  // effect must key off that combined readiness, not just breakdown's own
  // status. Otherwise, if `repositories` resolves after `breakdown`, this
  // effect already ran (and bailed on a still-unmounted ref) and never
  // fires again once the chart <div> finally mounts.
  const isReady = breakdown.status === 'success' && repositories.status === 'success'

  useEffect(() => {
    if (!isReady || !containerRef.current || breakdown.status !== 'success') return

    const chart = echarts.init(containerRef.current)
    chart.setOption(buildActivityChartOption(breakdown.data, readActivityChartTheme()))

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [isReady, breakdown.status, breakdown.data])

  if (isLoading) return <ActivityOverviewSkeleton />

  if (errorMessage) {
    return (
      <section className={styles.section}>
        <EmptyState icon={AlertTriangle} title="Couldn’t load activity overview" description={errorMessage} />
      </section>
    )
  }

  if (breakdown.status !== 'success' || repositories.status !== 'success') return null

  const summary = buildContributedToSummary(repositories.data, repositories.total)

  return (
    <section className={styles.section} aria-labelledby="activity-overview-heading">
      <div className={styles.text}>
        <h2 id="activity-overview-heading" className={styles.heading}>
          Activity overview
        </h2>

        {summary.shown.length > 0 && (
          <p className={styles.contributedTo}>
            <Book size={16} className={styles.icon} aria-hidden />
            <span>
              Contributed to <ContributedToLinks summary={summary} />
            </span>
          </p>
        )}
      </div>

      <div
        ref={containerRef}
        className={styles.chart}
        role="img"
        aria-label={`Activity overview radar chart: ${breakdown.data.commits}% commits, ${breakdown.data.pullRequests}% pull requests, ${breakdown.data.issues}% issues, ${breakdown.data.codeReview}% code review`}
      />
    </section>
  )
}

function ContributedToLinks({ summary }: { summary: ContributedToSummary }) {
  const { shown, remainingLabel } = summary
  if (shown.length === 0) return null

  const links = shown.map((repo) => (
    <a key={repo.id} href={repo.html_url} target="_blank" rel="noreferrer noopener">
      {repo.full_name}
    </a>
  ))

  // "repo1, repo2, repo3 and 12 other repositories" — every shown repo is
  // comma-joined, then "and <remaining>" is appended.
  if (remainingLabel) {
    return (
      <>
        {joinWithCommas(links)} and {remainingLabel}
      </>
    )
  }

  // Every contributed-to repo is already shown: "repo1, repo2 and repo3".
  if (links.length === 1) return links[0]

  return (
    <>
      {joinWithCommas(links.slice(0, -1))} and {links[links.length - 1]}
    </>
  )
}

function joinWithCommas(nodes: ReactNode[]): ReactNode {
  return nodes.map((node, index) => (
    <Fragment key={index}>
      {index > 0 && ', '}
      {node}
    </Fragment>
  ))
}
