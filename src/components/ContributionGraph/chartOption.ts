import type { ComposeOption } from 'echarts/core'
import type { HeatmapSeriesOption } from 'echarts/charts'
import type {
  CalendarComponentOption,
  TooltipComponentOption,
  VisualMapComponentOption,
} from 'echarts/components'
import type { ContributionCalendar, ContributionDay } from '../../types/contributions'
import { formatShortDate } from '../../utils/format'

type ContributionChartOption = ComposeOption<
  HeatmapSeriesOption | CalendarComponentOption | TooltipComponentOption | VisualMapComponentOption
>

/** The 5 heatmap tokens from index.css, read live so the chart stays in sync with the theme. */
const LEVEL_TOKENS = [
  '--color-calendar-graph-day-bg',
  '--color-calendar-graph-day-L1-bg',
  '--color-calendar-graph-day-L2-bg',
  '--color-calendar-graph-day-L3-bg',
  '--color-calendar-graph-day-L4-bg',
] as const

export interface ContributionChartTheme {
  levelColors: string[]
  mutedText: string
  canvasBg: string
}

/** Reads the CSS custom properties this chart needs. Must run in the browser. */
export function readContributionChartTheme(): ContributionChartTheme {
  const styles = getComputedStyle(document.documentElement)
  return {
    levelColors: LEVEL_TOKENS.map((token) => styles.getPropertyValue(token).trim()),
    mutedText: styles.getPropertyValue('--color-fg-muted').trim(),
    canvasBg: styles.getPropertyValue('--color-canvas-default').trim(),
  }
}

function getDays(calendar: ContributionCalendar): ContributionDay[] {
  return calendar.weeks
    .flatMap((week) => week.days)
    .filter((day): day is ContributionDay => day !== null)
}

/**
 * Builds the ECharts option for the GitHub-style contribution calendar,
 * using ECharts' built-in `calendar` coordinate system (month/weekday
 * labels come from it) with a `heatmap` series coloring each day.
 */
export function buildContributionChartOption(
  calendar: ContributionCalendar,
  theme: ContributionChartTheme,
): ContributionChartOption {
  const days = getDays(calendar)
  const startDate = days[0]?.date
  const endDate = days[days.length - 1]?.date
  const maxCount = Math.max(1, ...days.map((day) => day.count))

  return {
    // Required by ECharts' heatmap renderer even though every data point
    // below sets its own itemStyle.color explicitly — see the note in
    // ContributionGraph.tsx. The real "Less → More" legend is plain HTML
    // (ContributionGraph.tsx), so this one stays hidden.
    visualMap: {
      show: false,
      min: 0,
      max: maxCount,
      dimension: 1,
    },
    tooltip: {
      formatter: (params) => {
        const point = Array.isArray(params) ? params[0] : params
        const value = point.value as [string, number]
        const [date, count] = value
        const label = count === 1 ? '1 contribution' : `${count} contributions`
        return `${label} on ${formatShortDate(date)}`
      },
    },
    calendar: {
      range: [startDate, endDate],
      cellSize: [13, 13],
      orient: 'horizontal',
      top: 24,
      left: 32,
      right: 8,
      itemStyle: {
        borderWidth: 2,
        borderColor: theme.canvasBg,
      },
      splitLine: { show: false },
      yearLabel: { show: false },
      monthLabel: {
        color: theme.mutedText,
        fontSize: 12,
      },
      dayLabel: {
        firstDay: 0,
        nameMap: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
        color: theme.mutedText,
        fontSize: 11,
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: days.map((day) => ({
          value: [day.date, day.count],
          itemStyle: { color: theme.levelColors[day.level], borderRadius: 2 },
        })),
      },
    ],
  }
}
