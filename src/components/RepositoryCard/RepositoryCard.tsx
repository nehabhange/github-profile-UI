import { Star } from 'lucide-react'
import type { GitHubRepository } from '../../types/github'
import { getLanguageColor } from '../../utils/repositories'
import styles from './RepositoryCard.module.css'

interface RepositoryCardProps {
  repository: GitHubRepository
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  const visibilityLabel = repository.private ? 'Private' : 'Public'

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <a
          href={repository.html_url}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.name}
        >
          {repository.name}
        </a>
        <span className={styles.badge}>{visibilityLabel}</span>
        {repository.fork && <span className={styles.badge}>Forked</span>}
      </div>

      {repository.description && <p className={styles.description}>{repository.description}</p>}

      <div className={styles.footer}>
        {repository.language && (
          <span className={styles.language}>
            <span
              className={styles.languageDot}
              style={{ backgroundColor: getLanguageColor(repository.language) }}
              aria-hidden
            />
            {repository.language}
          </span>
        )}

        {repository.stargazers_count > 0 && (
          <span className={styles.stat}>
            <Star size={14} aria-hidden />
            {repository.stargazers_count}
          </span>
        )}
      </div>
    </article>
  )
}
