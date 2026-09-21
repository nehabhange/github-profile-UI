import { useEffect, useRef } from 'react'
import { Bell, ChevronDown, CircleDot, GitPullRequest, Menu, Plus, Search } from 'lucide-react'
import GitHubMark from './GitHubMark'
import styles from './Header.module.css'

interface HeaderProps {
  /** Username shown as the page context next to the GitHub mark. */
  username: string
  /** Avatar for the signed-in user control; falls back to a neutral circle. */
  avatarUrl?: string
}

const ICON_SIZE = 16

export default function Header({ username, avatarUrl }: HeaderProps) {
  const searchRef = useRef<HTMLInputElement>(null)

  // GitHub focuses search when "/" is pressed outside of a text field.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      if (event.key === '/' && !isTyping) {
        event.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <button
          type="button"
          className={`${styles.iconButton} ${styles.menuButton}`}
          aria-label="Open global navigation menu"
        >
          <Menu size={ICON_SIZE} />
        </button>

        <a href="/" className={styles.logo} aria-label="Homepage">
          <GitHubMark size={32} />
        </a>

        <span className={styles.context}>{username}</span>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <Search size={ICON_SIZE} className={styles.searchIcon} aria-hidden />
          <input
            ref={searchRef}
            type="search"
            className={styles.searchInput}
            placeholder="Type / to search"
            aria-label="Search GitHub"
          />
          <kbd className={styles.searchKbd}>/</kbd>
        </div>

        <button
          type="button"
          className={`${styles.iconButton} ${styles.searchButton}`}
          aria-label="Search"
        >
          <Search size={ICON_SIZE} />
        </button>

        <span className={styles.divider} aria-hidden />

        <button
          type="button"
          className={`${styles.iconButton} ${styles.createButton}`}
          aria-label="Create new"
        >
          <Plus size={ICON_SIZE} />
          <ChevronDown size={12} className={styles.chevron} />
        </button>

        <button
          type="button"
          className={`${styles.iconButton} ${styles.hideOnTablet}`}
          aria-label="Issues"
        >
          <CircleDot size={ICON_SIZE} />
        </button>

        <button
          type="button"
          className={`${styles.iconButton} ${styles.hideOnTablet}`}
          aria-label="Pull requests"
        >
          <GitPullRequest size={ICON_SIZE} />
        </button>

        <button
          type="button"
          className={styles.iconButton}
          aria-label="Notifications"
        >
          <Bell size={ICON_SIZE} />
          <span className={styles.notificationDot} />
        </button>

        <button type="button" className={styles.avatarButton} aria-label="Open user menu">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className={styles.avatar} width={32} height={32} />
          ) : (
            <span className={styles.avatarFallback} />
          )}
        </button>
      </div>
    </header>
  )
}
