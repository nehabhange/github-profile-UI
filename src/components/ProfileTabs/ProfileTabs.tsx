import { PROFILE_TABS } from './tabs'
import type { ProfileTab } from './tabs'
import styles from './ProfileTabs.module.css'

interface ProfileTabsProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  /** Optional counters rendered as badges, e.g. { repositories: 42 }. */
  counts?: Partial<Record<ProfileTab, number>>
}

export default function ProfileTabs({ activeTab, onTabChange, counts }: ProfileTabsProps) {
  return (
    <nav className={styles.nav} aria-label="Profile">
      <div className={styles.tabs} role="tablist">
        {PROFILE_TABS.map(({ id, label, icon: Icon }) => {
          const isActive = id === activeTab
          const count = counts?.[id]

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
              <Icon size={16} className={styles.icon} aria-hidden />
              <span>{label}</span>
              {count !== undefined && <span className={styles.counter}>{count}</span>}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
