import type { LucideIcon } from 'lucide-react'
import styles from './EmptyState.module.css'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
}

/** GitHub-style "blankslate" used for empty tabs and empty lists. */
export default function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className={styles.blankslate}>
      <Icon size={24} className={styles.icon} aria-hidden />
      <h2 className={styles.title}>{title}</h2>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
