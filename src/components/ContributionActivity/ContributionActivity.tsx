import type { LucideIcon } from 'lucide-react'
import { FolderGit2, GitCommitHorizontal, GitPullRequest, Eye } from 'lucide-react'
import { MOCK_ACTIVITY, type ActivityEvent, type ActivityType } from '../../data/mockData'
import { groupActivityByMonth } from '../../utils/activity'
import styles from './ContributionActivity.module.css'

const TYPE_ICON: Record<ActivityType, LucideIcon> = {
  commit: GitCommitHorizontal,
  'pull-request': GitPullRequest,
  review: Eye,
  repository: FolderGit2,
}

const TYPE_COLOR: Record<ActivityType, string> = {
  commit: '#1a7f37',
  'pull-request': '#8250df',
  review: '#0969da',
  repository: '#9a6700',
}

export default function ContributionActivity() {
  const monthGroups = groupActivityByMonth(MOCK_ACTIVITY)

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
    </section>
  )
}

function ActivityItem({ event }: { event: ActivityEvent }) {
  const Icon = TYPE_ICON[event.type]

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
