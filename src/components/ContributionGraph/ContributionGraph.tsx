import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { HeatmapChart } from 'echarts/charts'
import { CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { AlertTriangle } from 'lucide-react'
import { useContributionCalendar } from '../../hooks/useContributionCalendar'
import EmptyState from '../EmptyState/EmptyState'
import { buildContributionChartOption, readContributionChartTheme } from './chartOption'
import ContributionGraphSkeleton from './ContributionGraphSkeleton'
import styles from './ContributionGraph.module.css'

// ECharts' heatmap renderer hard-requires a registered visualMap component
// targeting the series, even when every data point sets its own itemStyle
// color explicitly (as this chart does, from precomputed day levels). The
// visualMap below stays hidden — it exists only to satisfy that invariant.
echarts.use([HeatmapChart, CalendarComponent, TooltipComponent, VisualMapComponent, CanvasRenderer])

interface ContributionGraphProps {
  username: string
}

const MIN_CHART_WIDTH = 680
const PIXELS_PER_WEEK = 15
const CHART_HORIZONTAL_PADDING = 40

export default function ContributionGraph({ username }: ContributionGraphProps) {
  const calendar = useContributionCalendar(username)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (calendar.status !== 'success' || !containerRef.current) return

    const chart = echarts.init(containerRef.current)
    chart.setOption(buildContributionChartOption(calendar.data, readContributionChartTheme()))

    const handleResize = () => chart.resize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      chart.dispose()
    }
  }, [calendar.status, calendar.data])

  if (calendar.status === 'loading') {
    return <ContributionGraphSkeleton />
  }

  if (calendar.status === 'error') {
    return (
      <section className={styles.section}>
        <EmptyState
          icon={AlertTriangle}
          title="Couldn’t load contribution activity"
          description={calendar.error}
        />
      </section>
    )
  }

  const weekCount = calendar.data.weeks.length
  // Fixed cell sizing (not a fluid width) so narrow viewports scroll the
  // graph horizontally instead of squeezing the squares unreadably small.
  const chartWidth = Math.max(MIN_CHART_WIDTH, weekCount * PIXELS_PER_WEEK + CHART_HORIZONTAL_PADDING)

  return (
    <section className={styles.section} aria-labelledby="contribution-graph-heading">
      <h2 id="contribution-graph-heading" className={styles.heading}>
        {calendar.data.totalContributions.toLocaleString()} contributions in the last year
      </h2>

      <div className={styles.scrollArea}>
        <div
          ref={containerRef}
          className={styles.chart}
          style={{ width: chartWidth, minWidth: chartWidth }}
          role="img"
          aria-label={`Contribution calendar heatmap: ${calendar.data.totalContributions} contributions in the last year`}
        />
      </div>

      <div className={styles.legend}>
        <span>Less</span>
        <span className={`${styles.swatch} ${styles.level0}`} aria-hidden />
        <span className={`${styles.swatch} ${styles.level1}`} aria-hidden />
        <span className={`${styles.swatch} ${styles.level2}`} aria-hidden />
        <span className={`${styles.swatch} ${styles.level3}`} aria-hidden />
        <span className={`${styles.swatch} ${styles.level4}`} aria-hidden />
        <span>More</span>
      </div>
    </section>
  )
}
