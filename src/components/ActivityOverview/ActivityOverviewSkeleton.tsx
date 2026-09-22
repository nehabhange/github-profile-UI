import styles from './ActivityOverview.module.css'

/**
 * Lightweight loading placeholder that does not import ECharts — mirrors
 * `ContributionGraphSkeleton`'s role for this section.
 */
export default function ActivityOverviewSkeleton() {
  return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.skeleton} />
    </section>
  )
}
