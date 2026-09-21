import type { GitHubRepository } from '../types/github'

/**
 * Picks a reasonable subset of repositories for the "Popular repositories"
 * section. GitHub's real "pinned" selection is a manual, user-curated list
 * with no public API — as a stand-in, this ranks by stars (most GitHub-like
 * signal of popularity) and falls back to recency, then takes the top N.
 * Intentionally simple: no per-repo scoring, no extra API calls.
 */
export function selectPopularRepositories(
  repos: GitHubRepository[],
  limit = 6,
): GitHubRepository[] {
  return [...repos]
    .sort((a, b) => {
      if (b.stargazers_count !== a.stargazers_count) {
        return b.stargazers_count - a.stargazers_count
      }
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
    .slice(0, limit)
}

/**
 * A subset of GitHub's official linguist colors for common languages.
 * Falls back to a neutral gray for anything not listed.
 */
const LANGUAGE_COLORS: Record<string, string> = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572a5',
  Java: '#b07219',
  'C++': '#f34b7d',
  C: '#555555',
  'C#': '#178600',
  Go: '#00add8',
  Rust: '#dea584',
  Ruby: '#701516',
  PHP: '#4f5d95',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Shell: '#89e051',
  Swift: '#f05138',
  Kotlin: '#a97bff',
  Dart: '#00b4ab',
  'Jupyter Notebook': '#da5b0b',
}

const DEFAULT_LANGUAGE_COLOR = '#8a8a8a'

export function getLanguageColor(language: string): string {
  return LANGUAGE_COLORS[language] ?? DEFAULT_LANGUAGE_COLOR
}
