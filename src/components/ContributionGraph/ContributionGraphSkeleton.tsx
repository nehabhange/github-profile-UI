import styles from './ContributionGraph.module.css'

/**
 * Lightweight loading placeholder that does not import ECharts. Used both
 * as the `<Suspense>` fallback while the (lazy-loaded) ContributionGraph
 * chunk downloads, and as that component's own internal loading state
 * once the chunk has loaded but the contribution data hasn't resolved yet.
 */
export default function ContributionGraphSkeleton() {
  return (
    <section className={styles.section} aria-busy="true">
      <div className={styles.skeleton} />
    </section>
  )
}
