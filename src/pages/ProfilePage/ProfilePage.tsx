import styles from './ProfilePage.module.css'

/**
 * Page-level layout for the GitHub profile view.
 *
 * Phase 1: structural shell only. Each region is a placeholder that will be
 * replaced by a real component in later phases (Header, ProfileTabs,
 * ProfileSidebar, PopularRepositories, ContributionGraph, Footer).
 */
export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.placeholder}>Header</div>
      </header>

      <nav className={styles.tabs} aria-label="Profile">
        <div className={styles.placeholder}>Profile navigation</div>
      </nav>

      <main className={styles.layout}>
        <aside className={styles.sidebar}>
          <div className={styles.placeholder}>Profile sidebar</div>
        </aside>

        <section className={styles.content} aria-label="Overview">
          <div className={styles.placeholder}>Main content</div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.placeholder}>Footer</div>
      </footer>
    </div>
  )
}
