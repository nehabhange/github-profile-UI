import { useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Header from '../../components/Header/Header'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import { PROFILE_TABS } from '../../components/ProfileTabs/tabs'
import type { ProfileTab } from '../../components/ProfileTabs/tabs'
import EmptyState from '../../components/EmptyState/EmptyState'
import { useGitHubProfile } from '../../hooks/useGitHubProfile'
import styles from './ProfilePage.module.css'

const USERNAME = 'shreeramk'

/**
 * Page-level layout for the GitHub profile view.
 *
 * Owns the active-tab state and the profile fetch. Only the Overview tab
 * renders full content; the other tabs intentionally show a minimal
 * blankslate, as allowed by the assignment.
 */
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview')
  const profile = useGitHubProfile(USERNAME)

  return (
    <div className={styles.page}>
      <Header username={USERNAME} avatarUrl={profile.data?.avatar_url} />

      <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <ProfileSidebarPlaceholder profile={profile} />
        </aside>

        <section
          className={styles.content}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'overview' ? (
            <div className={styles.placeholder}>Main content</div>
          ) : (
            <TabBlankslate tab={activeTab} />
          )}
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.placeholder}>Footer</div>
      </footer>
    </div>
  )
}

/**
 * Stand-in for the real ProfileSidebar (Phase 4). Demonstrates the
 * profile API's loading/error/success states until the full sidebar UI
 * lands.
 */
function ProfileSidebarPlaceholder({ profile }: { profile: ReturnType<typeof useGitHubProfile> }) {
  if (profile.status === 'loading') {
    return <div className={styles.placeholder}>Loading profile…</div>
  }

  if (profile.status === 'error') {
    return (
      <EmptyState icon={AlertTriangle} title="Couldn’t load this profile" description={profile.error} />
    )
  }

  return (
    <div className={styles.placeholder}>
      Loaded: {profile.data.name ?? profile.data.login} (@{profile.data.login})
    </div>
  )
}

function TabBlankslate({ tab }: { tab: ProfileTab }) {
  const definition = PROFILE_TABS.find((t) => t.id === tab)
  if (!definition) return null

  return (
    <EmptyState
      icon={definition.icon}
      title={`${USERNAME} doesn’t have any ${definition.label.toLowerCase()} yet.`}
      description="This tab is intentionally minimal — only the Overview tab is in scope for this assignment."
    />
  )
}
