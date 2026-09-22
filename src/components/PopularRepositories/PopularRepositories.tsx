import { AlertTriangle, BookOpen } from 'lucide-react'
import { useGitHubRepositories } from '../../hooks/useGitHubRepositories'
import RepositoryCard from '../RepositoryCard/RepositoryCard'
import EmptyState from '../EmptyState/EmptyState'
import styles from './PopularRepositories.module.css'

interface PopularRepositoriesProps {
  username: string
}

export default function PopularRepositories({ username }: PopularRepositoriesProps) {
  const repositories = useGitHubRepositories(username)

  return (
    <section aria-labelledby="popular-repositories-heading" className={styles.section}>
      <h2 id="popular-repositories-heading" className={styles.heading}>
        Popular repositories
      </h2>

      {repositories.status === 'loading' && (
        <div className={styles.grid} aria-hidden>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={styles.skeletonCard} />
          ))}
        </div>
      )}

      {repositories.status === 'error' && (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn’t load repositories"
          description={repositories.error}
        />
      )}

      {repositories.status === 'success' &&
        (repositories.data.length > 0 ? (
          <div className={styles.grid}>
            {repositories.data.map((repository) => (
              <RepositoryCard key={repository.id} repository={repository} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={BookOpen}
            title="No public repositories yet"
            description={`${username} hasn’t published any repositories.`}
          />
        ))}
    </section>
  )
}
