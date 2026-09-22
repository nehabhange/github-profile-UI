import GitHubMark from '../Header/GitHubMark'
import styles from './Footer.module.css'

const FOOTER_LINKS = [
  'Terms',
  'Privacy',
  'Security',
  'Status',
  'Docs',
  'Contact',
  'Manage cookies',
  'Do not share my personal information',
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a href="/" className={styles.mark} aria-label="GitHub homepage">
          <GitHubMark size={24} />
        </a>

        <span className={styles.copyright}>© {new Date().getFullYear()} GitHub, Inc.</span>

        <ul className={styles.links}>
          {FOOTER_LINKS.map((label) => (
            <li key={label}>
              <a href="#">{label}</a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  )
}
