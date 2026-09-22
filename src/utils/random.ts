/**
 * Small, dependency-free seeded PRNG (mulberry32). Seeding from a stable
 * value (like a username) means generated data is reproducible across
 * reloads for the same profile, instead of reshuffling on every render.
 * Shared by every deterministic generator (contribution calendar, activity
 * overview) that stands in for data with no public, unauthenticated API.
 */
export function mulberry32(seed: number): () => number {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let t = Math.imul(state ^ (state >>> 15), 1 | state)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function hashString(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i)
    hash |= 0
  }
  return hash
}
