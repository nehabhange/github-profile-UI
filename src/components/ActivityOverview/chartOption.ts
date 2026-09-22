import type { ComposeOption } from 'echarts/core'
import type { RadarSeriesOption } from 'echarts/charts'
import type { RadarComponentOption, TooltipComponentOption } from 'echarts/components'
import type { ActivityBreakdown } from '../../types/activityOverview'

type ActivityChartOption = ComposeOption<
  RadarSeriesOption | RadarComponentOption | TooltipComponentOption
>

export interface ActivityChartTheme {
  lineColor: string
  areaColor: string
  mutedText: string
}

/** Reads the CSS custom properties this chart needs. Must run in the browser. */
export function readActivityChartTheme(): ActivityChartTheme {
  const styles = getComputedStyle(document.documentElement)
  const lineColor = styles.getPropertyValue('--color-calendar-graph-day-L3-bg').trim()
  return {
    lineColor,
    areaColor: styles.getPropertyValue('--color-calendar-graph-day-L1-bg').trim(),
    mutedText: styles.getPropertyValue('--color-fg-muted').trim(),
  }
}

/** "62%\nCommits" when there's activity, or just "Commits" when the value is 0 — matches GitHub's own radar labels. */
function axisLabel(name: string, value: number): string {
  return value > 0 ? `${value}%\n${name}` : name
}

/**
 * Builds the ECharts radar option for GitHub's "Activity overview" widget.
 *
 * ECharts places 4-indicator radars counter-clockwise starting from the
 * top (top → left → bottom → right) — confirmed empirically via a
 * rendered screenshot, not assumed. So to match the real widget's actual
 * layout (top=Code review, right=Issues, bottom=Pull requests,
 * left=Commits), the indicator array order must be
 * [Code review, Commits, Pull requests, Issues].
 */
export function buildActivityChartOption(
  breakdown: ActivityBreakdown,
  theme: ActivityChartTheme,
): ActivityChartOption {
  const { codeReview, issues, pullRequests, commits } = breakdown

  return {
    tooltip: {},
    radar: {
      indicator: [
        { name: axisLabel('Code review', codeReview), max: 100 },
        { name: axisLabel('Commits', commits), max: 100 },
        { name: axisLabel('Pull requests', pullRequests), max: 100 },
        { name: axisLabel('Issues', issues), max: 100 },
      ],
      shape: 'polygon',
      splitNumber: 4,
      axisLine: { lineStyle: { color: theme.lineColor } },
      splitLine: { show: false },
      splitArea: { show: false },
      axisName: { color: theme.mutedText, fontSize: 12, lineHeight: 16 },
    },
    series: [
      {
        type: 'radar',
        symbolSize: 6,
        lineStyle: { color: theme.lineColor, width: 2 },
        itemStyle: { color: theme.lineColor },
        areaStyle: { color: theme.areaColor, opacity: 0.5 },
        tooltip: {
          formatter: () =>
            `Code review: ${codeReview}%<br/>Issues: ${issues}%<br/>Pull requests: ${pullRequests}%<br/>Commits: ${commits}%`,
        },
        data: [{ value: [codeReview, commits, pullRequests, issues] }],
      },
    ],
  }
}
