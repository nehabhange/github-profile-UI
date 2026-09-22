import { useState } from 'react'
import type { LucideIcon } from 'lucide-react'
import { FolderGit2, GitCommitHorizontal, GitPullRequest, Eye, Lock } from 'lucide-react'
import { MOCK_ACTIVITY, MOCK_ACTIVITY_MORE, type ActivityEvent, type ActivityType } from '../../data/mockData'
import { groupActivityByMonth } from '../../utils/activity'
import { currentMonthDateRange } from '../../utils/format'
import styles from './ContributionActivity.module.css'

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  commit: GitCommitHorizontal,
  'pull-request': GitPullRequest,
  review: Eye,
  repository: FolderGit2,
  private: Lock,
}

const TYPE_COLOR: Record<ActivityType, string> = {
  commit: '#1a7f37',
  'pull-request': '#8250df',
  review: '#0969da',
  repository: '#9a6700',
  private: '#656d76',
}

export default function ContributionActivity() {
  const [showMore, setShowMore] = useState(false)
  const events = showMore ? [...MOCK_ACTIVITY, ...MOCK_ACTIVITY_MORE] : MOCK_ACTIVITY
  const monthGroups = groupActivityByMonth(events)

  return (
    <section aria-labelledby="contribution-activity-heading" className={styles.section}>
      <h2 id="contribution-activity-heading" className={styles.heading}>
        Contribution activity
      </h2>

      {monthGroups.map((group) => (
        <div key={group.label} className={styles.monthGroup}>
          <h3 className={styles.monthLabel}>{group.label}</h3>

          <ul className={styles.timeline}>
            {group.events.map((event) => (
              <ActivityItem key={event.id} event={event} />
            ))}
          </ul>
        </div>
      ))}

      {!showMore && (
        <button type="button" className={styles.showMoreButton} onClick={() => setShowMore(true)}>
          Show more activity
        </button>
      )}
    </section>
  )
}

function ActivityItem({ event }: { event: ActivityEvent }) {
  const Icon = TYPE_ICON[event.type]

  if (event.type === 'private') {
    return (
      <li className={styles.item}>
        <div className={styles.iconColumn}>
          <span className={styles.iconBadge} style={{ backgroundColor: TYPE_COLOR.private }}>
            <Icon size={14} color="#ffffff" aria-hidden />
          </span>
        </div>

        <div className={`${styles.content} ${styles.privateRow}`}>
          <p className={styles.summary}>{event.summary}</p>
          <span className={styles.dateRange}>{currentMonthDateRange()}</span>
        </div>
      </li>
    )
  }

  return (
    <li className={styles.item}>
      <div className={styles.iconColumn}>
        <span className={styles.iconBadge} style={{ backgroundColor: TYPE_COLOR[event.type] }}>
          <Icon size={14} color="#ffffff" aria-hidden />
        </span>
      </div>

      <div className={styles.content}>
        <p className={styles.summary}>{event.summary}</p>
        {event.repositories.length > 0 && (
          <ul className={styles.repoList}>
            {event.repositories.map((repo) => (
              <li key={repo} className={styles.repoChip}>
                {repo}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}
