import { lazy, Suspense, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import Header from '../../components/Header/Header'
import ProfileTabs from '../../components/ProfileTabs/ProfileTabs'
import { PROFILE_TABS } from '../../components/ProfileTabs/tabs'
import type { ProfileTab } from '../../components/ProfileTabs/tabs'
import EmptyState from '../../components/EmptyState/EmptyState'
import ProfileSidebar from '../../components/ProfileSidebar/ProfileSidebar'
import PopularRepositories from '../../components/PopularRepositories/PopularRepositories'
import ContributionGraphSkeleton from '../../components/ContributionGraph/ContributionGraphSkeleton'
import ContributionActivity from '../../components/ContributionActivity/ContributionActivity'
import ActivityOverviewSkeleton from '../../components/ActivityOverview/ActivityOverviewSkeleton'
import Footer from '../../components/Footer/Footer'
import { useGitHubProfile } from '../../hooks/useGitHubProfile'
import styles from './ProfilePage.module.css'

// ECharts pulls in a sizeable chunk (~650KB) — load it only when the
// Overview tab actually needs to render a chart, instead of bundling it
// into the initial page load.
const ContributionGraph = lazy(() => import('../../components/ContributionGraph/ContributionGraph'))
const ActivityOverview = lazy(() => import('../../components/ActivityOverview/ActivityOverview'))

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
          <ProfileSidebarSlot profile={profile} />
        </aside>

        <section
          className={styles.content}
          role="tabpanel"
          id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
        >
          {activeTab === 'overview' ? (
            <>
              <PopularRepositories username={USERNAME} />
              <Suspense fallback={<ContributionGraphSkeleton />}>
                <ContributionGraph username={USERNAME} />
              </Suspense>
              <Suspense fallback={<ActivityOverviewSkeleton />}>
                <ActivityOverview username={USERNAME} />
              </Suspense>
              <ContributionActivity />
            </>
          ) : (
            <TabBlankslate tab={activeTab} />
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}

/** Renders the sidebar's loading/error/success states around the real ProfileSidebar. */
function ProfileSidebarSlot({ profile }: { profile: ReturnType<typeof useGitHubProfile> }) {
  if (profile.status === 'loading') {
    return <div className={styles.placeholder}>Loading profile…</div>
  }

  if (profile.status === 'error') {
    return (
      <EmptyState icon={AlertTriangle} title="Couldn’t load this profile" description={profile.error} />
    )
  }

  return <ProfileSidebar user={profile.data} />
}

function TabBlankslate({ tab }: { tab: ProfileTab }) {
  const definition = PROFILE_TABS.find((t) => t.id === tab)
  if (!definition) return null

  return (
    <EmptyState
      icon={definition.icon}
      title={`${definition.label} isn’t part of this build`}
      description="This tab is intentionally minimal — only the Overview tab is in scope for this assignment."
    />
  )
}
