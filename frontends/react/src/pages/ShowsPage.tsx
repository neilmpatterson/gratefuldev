import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchShows } from '@/lib/data'
import { applySearch } from '@/lib/parseSearch'
import Pagination from '@/components/Pagination'

const selectClass = 'bg-surface border border-edge rounded px-3 py-1.5 text-sm text-paper focus:outline-none focus:border-accent'

export default function ShowsPage() {
  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: fetchShows,
  })

  const [searchParams] = useSearchParams()

  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [year, setYear] = useState(searchParams.get('year') ?? '')
  const [state, setState] = useState(searchParams.get('state') ?? '')
  const [city, setCity] = useState(searchParams.get('city') ?? '')
  const [venue, setVenue] = useState(searchParams.get('venue') ?? '')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
    setYear(searchParams.get('year') ?? '')
    setState(searchParams.get('state') ?? '')
    setCity(searchParams.get('city') ?? '')
    setVenue(searchParams.get('venue') ?? '')
    setPage(1)
  }, [searchParams])

  const years = useMemo(() => [...new Set(shows.map(s => s.year))].sort(), [shows])

  const states = useMemo(() => {
    const src = year ? shows.filter(s => s.year === Number(year)) : shows
    return [...new Set(src.map(s => s.state).filter(Boolean))].sort()
  }, [shows, year])

  const cities = useMemo(() => {
    const src = shows.filter(s =>
      (!year || s.year === Number(year)) && (!state || s.state === state)
    )
    return [...new Set(src.map(s => s.city).filter(Boolean))].sort()
  }, [shows, year, state])

  const venues = useMemo(() => {
    const src = shows.filter(s =>
      (!year || s.year === Number(year)) &&
      (!state || s.state === state) &&
      (!city || s.city === city)
    )
    return [...new Set(src.map(s => s.venue).filter(Boolean))].sort()
  }, [shows, year, state, city])

  const filtered = useMemo(() => {
    const byDropdowns = shows.filter(s =>
      (!year || s.year === Number(year)) &&
      (!state || s.state === state) &&
      (!city || s.city === city) &&
      (!venue || s.venue === venue)
    )
    return applySearch(byDropdowns, q)
  }, [shows, year, state, city, venue, q])

  const pageCount = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function reset() { setQ(''); setYear(''); setState(''); setCity(''); setVenue(''); setPage(1) }
  function handleYear(v: string) { setYear(v); setState(''); setCity(''); setVenue(''); setPage(1) }
  function handleState(v: string) { setState(v); setCity(''); setVenue(''); setPage(1) }
  function handleCity(v: string) { setCity(v); setVenue(''); setPage(1) }
  function handleVenue(v: string) { setVenue(v); setPage(1) }
  function handleSearch(v: string) { setQ(v); setPage(1) }
  function handlePageSize(n: number) { setPageSize(n); setPage(1) }

  const hasFilters = q || year || state || city || venue

  if (isLoading) return <p className="text-muted">Loading shows…</p>

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-paper">Shows</h1>
        <span className="text-sm text-muted tabular-nums">{filtered.length.toLocaleString()}</span>
      </div>

      <input
        type="search"
        placeholder="Search by venue, city, year (1977), or date (7/4/1995)…"
        value={q}
        onChange={e => handleSearch(e.target.value)}
        className="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-3 focus:outline-none focus:border-accent"
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <select value={year} onChange={e => handleYear(e.target.value)} className={selectClass}>
          <option value="">All years</option>
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
        <select value={state} onChange={e => handleState(e.target.value)} className={selectClass}>
          <option value="">All states</option>
          {states.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={city} onChange={e => handleCity(e.target.value)} className={selectClass}>
          <option value="">All cities</option>
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={venue} onChange={e => handleVenue(e.target.value)} className={selectClass}>
          <option value="">All venues</option>
          {venues.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        {hasFilters && (
          <button onClick={reset} className="text-sm text-muted hover:text-paper transition-colors px-2">
            Clear filters
          </button>
        )}
      </div>

      <div className="divide-y divide-edge">
        {paged.map(show => (
          <div key={show.uuid} className="flex items-center gap-4 py-3 text-sm group">
            <span className="font-mono text-muted w-24 shrink-0 tabular-nums">{show.date}</span>
            <Link
              to={`/shows/${show.uuid}`}
              className="flex-1 text-paper hover:text-accent transition-colors"
            >
              {show.venue}
            </Link>
            <Link
              to={`/shows?city=${encodeURIComponent(show.city)}&state=${encodeURIComponent(show.state ?? '')}`}
              className="text-muted hover:text-accent transition-colors shrink-0 text-right"
            >
              {show.city}{show.state ? `, ${show.state}` : ''}
            </Link>
          </div>
        ))}
        {paged.length === 0 && (
          <p className="text-muted py-10 text-center">No shows match.</p>
        )}
      </div>

      <Pagination
        page={page}
        pageCount={pageCount}
        pageSize={pageSize}
        onPage={setPage}
        onPageSize={handlePageSize}
      />
    </div>
  )
}
