/**
 * Shape of the GitHub REST API response for `GET /users/:username`.
 *
 * Only the fields this app actually renders are declared; the real response
 * has more (gists_url, following_url templates, etc.) that we don't use.
 * See: https://docs.github.com/en/rest/users/users#get-a-user
 */
export interface GitHubUser {
  login: string
  id: number
  avatar_url: string
  html_url: string
  name: string | null
  company: string | null
  blog: string | null
  location: string | null
  email: string | null
  bio: string | null
  twitter_username: string | null
  public_repos: number
  followers: number
  following: number
  created_at: string
}

/**
 * Shape of one entry from `GET /users/:username/repos`.
 *
 * See: https://docs.github.com/en/rest/repos/repos#list-repositories-for-a-user
 */
export interface GitHubRepository {
  id: number
  name: string
  full_name: string
  html_url: string
  description: string | null
  fork: boolean
  private: boolean
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
}

/**
 * A structured API error so components can branch on `status` (e.g. render
 * a "rate limited" message for 403, "not found" for 404) instead of
 * pattern-matching a generic Error message.
 */
export class GitHubApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'GitHubApiError'
    this.status = status
  }
}
