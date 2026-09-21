import { Building2, Calendar, Link as LinkIcon, Mail, MapPin, AtSign } from 'lucide-react'
import type { GitHubUser } from '../../types/github'
import { MOCK_ACHIEVEMENTS, MOCK_ORGANIZATIONS } from '../../data/mockData'
import { displayUrl, formatJoinDate, normalizeUrl } from '../../utils/format'
import styles from './ProfileSidebar.module.css'

interface ProfileSidebarProps {
  user: GitHubUser
}

export default function ProfileSidebar({ user }: ProfileSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <img
        src={user.avatar_url}
        alt={`${user.login}'s avatar`}
        className={styles.avatar}
        width={296}
        height={296}
      />

      <h1 className={styles.name}>{user.name ?? user.login}</h1>
      <p className={styles.username}>{user.login}</p>

      {user.bio && <p className={styles.bio}>{user.bio}</p>}

      <button type="button" className={styles.followButton}>
        Follow
      </button>

      <ul className={styles.stats}>
        <li>
          <span className={styles.statCount}>{user.followers}</span> followers
        </li>
        <li aria-hidden className={styles.statDot}>
          ·
        </li>
        <li>
          <span className={styles.statCount}>{user.following}</span> following
        </li>
      </ul>

      <ul className={styles.details}>
        {user.company && (
          <li>
            <Building2 size={16} className={styles.detailIcon} aria-hidden />
            <span>{user.company}</span>
          </li>
        )}

        {user.location && (
          <li>
            <MapPin size={16} className={styles.detailIcon} aria-hidden />
            <span>{user.location}</span>
          </li>
        )}

        {user.email && (
          <li>
            <Mail size={16} className={styles.detailIcon} aria-hidden />
            <a href={`mailto:${user.email}`}>{user.email}</a>
          </li>
        )}

        {user.blog && (
          <li>
            <LinkIcon size={16} className={styles.detailIcon} aria-hidden />
            <a href={normalizeUrl(user.blog)} target="_blank" rel="noreferrer noopener">
              {displayUrl(user.blog)}
            </a>
          </li>
        )}

        {user.twitter_username && (
          <li>
            <AtSign size={16} className={styles.detailIcon} aria-hidden />
            <a
              href={`https://twitter.com/${user.twitter_username}`}
              target="_blank"
              rel="noreferrer noopener"
            >
              {user.twitter_username}
            </a>
          </li>
        )}

        <li>
          <Calendar size={16} className={styles.detailIcon} aria-hidden />
          <span>{formatJoinDate(user.created_at)}</span>
        </li>
      </ul>

      <hr className={styles.divider} />

      <section aria-labelledby="achievements-heading">
        <h2 id="achievements-heading" className={styles.sectionHeading}>
          Achievements
        </h2>
        <ul className={styles.achievements}>
          {MOCK_ACHIEVEMENTS.map(({ id, label, icon: Icon, color }) => (
            <li key={id} title={label}>
              <span className={styles.achievementBadge} style={{ backgroundColor: color }}>
                <Icon size={18} color="#ffffff" aria-hidden />
              </span>
              <span className={styles.srOnly}>{label}</span>
            </li>
          ))}
        </ul>
      </section>

      <hr className={styles.divider} />

      <section aria-labelledby="organizations-heading">
        <h2 id="organizations-heading" className={styles.sectionHeading}>
          Organizations
        </h2>
        <ul className={styles.organizations}>
          {MOCK_ORGANIZATIONS.map((org) => (
            <li key={org.id}>
              <a href={org.url} target="_blank" rel="noreferrer noopener" title={org.name}>
                <span className={styles.orgAvatar} style={{ backgroundColor: org.color }}>
                  {org.initial}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
