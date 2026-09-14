import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchVenues } from '@/lib/data'
import Pagination from '@/components/Pagination'

export default function VenuesPage() {
  const { data: venues = [], isLoading } = useQuery({
    queryKey: ['venues'],
    queryFn: fetchVenues,
  })

  const [searchParams] = useSearchParams()
  const [q, setQ] = useState(searchParams.get('q') ?? '')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  useEffect(() => {
    setQ(searchParams.get('q') ?? '')
    setPage(1)
  }, [searchParams])

  const filtered = useMemo(() => {
    const sorted = [...venues].sort((a, b) => b.show_count - a.show_count)
    if (!q.trim()) return sorted
    const term = q.toLowerCase()
    return sorted.filter(v =>
      v.venue?.toLowerCase().includes(term) ||
      v.city?.toLowerCase().includes(term) ||
      v.state?.toLowerCase().includes(term)
    )
  }, [venues, q])

  const pageCount = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch(v: string) { setQ(v); setPage(1) }
  function handlePageSize(n: number) { setPageSize(n); setPage(1) }

  if (isLoading) return <p className="text-muted">Loading venues…</p>

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-paper">Venues</h1>
        <span className="text-sm text-muted tabular-nums">{filtered.length.toLocaleString()}</span>
      </div>

      <input
        type="search"
        placeholder="Search venues…"
        value={q}
        onChange={e => handleSearch(e.target.value)}
        className="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
      />

      <div className="divide-y divide-edge">
        {paged.map((v, i) => (
          <Link
            key={i}
            to={`/shows?venue=${encodeURIComponent(v.venue)}&city=${encodeURIComponent(v.city)}&state=${encodeURIComponent(v.state ?? '')}`}
            className="flex items-center justify-between py-3 group"
          >
            <div>
              <p className="text-paper group-hover:text-accent transition-colors">{v.venue}</p>
              <p className="text-sm text-muted">{v.city}{v.state ? `, ${v.state}` : ''} · {v.country}</p>
            </div>
            <span className="text-accent text-sm tabular-nums ml-4 shrink-0">{v.show_count} shows</span>
          </Link>
        ))}
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
