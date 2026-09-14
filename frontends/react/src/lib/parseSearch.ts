import type { ShowSummary } from './data'

function parseDate(q: string): string | null {
  // M/D/YYYY or MM/DD/YYYY (and hyphen variants)
  const mdy = q.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (mdy) {
    const [, m, d, y] = mdy
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  // YYYY/M/D or YYYY-M-D
  const ymd = q.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
  if (ymd) {
    const [, y, m, d] = ymd
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`
  }
  return null
}

export function applySearch(shows: ShowSummary[], q: string): ShowSummary[] {
  const term = q.trim()
  if (!term) return shows

  // Bare 4-digit year
  if (/^\d{4}$/.test(term)) {
    const y = Number(term)
    return shows.filter(s => s.year === y)
  }

  // Date pattern
  const date = parseDate(term)
  if (date) {
    return shows.filter(s => s.date === date)
  }

  // Text — venue, city, state
  const lower = term.toLowerCase()
  return shows.filter(s =>
    s.venue?.toLowerCase().includes(lower) ||
    s.city?.toLowerCase().includes(lower) ||
    s.state?.toLowerCase().includes(lower)
  )
}
