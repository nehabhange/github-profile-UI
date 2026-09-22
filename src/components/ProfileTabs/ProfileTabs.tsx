import { PROFILE_TABS } from './tabs'
import type { ProfileTab } from './tabs'
import styles from './ProfileTabs.module.css'

interface ProfileTabsProps {
  username: string
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  /** Optional counters rendered as badges, e.g. { repositories: 42 }. */
  counts?: Partial<Record<ProfileTab, number>>
}

export default function ProfileTabs({ username, activeTab, onTabChange, counts }: ProfileTabsProps) {
  const externalTabs = PROFILE_TABS.filter((tab) => tab.githubTab)

  return (
    <nav className={styles.nav} aria-label="Profile">
      <div className={styles.tabs}>
        {PROFILE_TABS.map(({ id, label, icon: Icon, githubTab }) => {
          const isActive = id === activeTab
          const count = counts?.[id]

          const contents = (
            <>
              <Icon size={16} className={styles.icon} aria-hidden />
              <span>{label}</span>
              {count !== undefined && count > 0 && <span className={styles.counter}>{count}</span>}
            </>
          )

          if (githubTab) {
            return (
              <a
                key={id}
                href={`https://github.com/${encodeURIComponent(username)}?tab=${githubTab}`}
                className={`${styles.tab} ${styles.externalTab}`}
              >
                {contents}
              </a>
            )
          }

          return (
            <button
              key={id}
              type="button"
              role="tab"
              id={`tab-${id}`}
              aria-selected={isActive}
              aria-controls={`panel-${id}`}
              tabIndex={isActive ? 0 : -1}
              className={`${styles.tab} ${isActive ? styles.active : ''}`}
              onClick={() => onTabChange(id)}
            >
              {contents}
            </button>
          )
        })}

        <details className={styles.moreMenu}>
          <summary className={styles.moreTrigger}>More</summary>
          <div className={styles.morePanel}>
            {externalTabs.map(({ id, label, githubTab, icon: Icon }) => (
              <a
                key={id}
                href={`https://github.com/${encodeURIComponent(username)}?tab=${githubTab}`}
                className={styles.moreItem}
              >
                <Icon size={16} aria-hidden />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </details>
      </div>
    </nav>
  )
}
