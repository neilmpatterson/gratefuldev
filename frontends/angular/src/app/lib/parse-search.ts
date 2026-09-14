import type { ShowSummary } from './data'

function parseDate(q: string): string | null {
  const mdy = q.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (mdy) {
    const [, m, d, y] = mdy
    return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`
  }
  const ymd = q.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/)
  if (ymd) {
    const [, y, m, d] = ymd
    return `${y}-${m!.padStart(2, '0')}-${d!.padStart(2, '0')}`
  }
  return null
}

export function applySearch(shows: ShowSummary[], q: string): ShowSummary[] {
  const term = q.trim()
  if (!term) return shows

  if (/^\d{4}$/.test(term)) {
    const y = Number(term)
    return shows.filter(s => s.year === y)
  }

  const date = parseDate(term)
  if (date) return shows.filter(s => s.date === date)

  const lower = term.toLowerCase()
  return shows.filter(s =>
    s.venue?.toLowerCase().includes(lower) ||
    s.city?.toLowerCase().includes(lower) ||
    s.state?.toLowerCase().includes(lower)
  )
}
