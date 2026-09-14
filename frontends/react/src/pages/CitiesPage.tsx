import { useState, useMemo, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchCities } from '@/lib/data'
import Pagination from '@/components/Pagination'

export default function CitiesPage() {
  const { data: cities = [], isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: fetchCities,
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
    const sorted = [...cities].sort((a, b) => b.show_count - a.show_count)
    if (!q.trim()) return sorted
    const term = q.toLowerCase()
    return sorted.filter(c =>
      c.city?.toLowerCase().includes(term) ||
      c.state?.toLowerCase().includes(term) ||
      c.country?.toLowerCase().includes(term)
    )
  }, [cities, q])

  const pageCount = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch(v: string) { setQ(v); setPage(1) }
  function handlePageSize(n: number) { setPageSize(n); setPage(1) }

  if (isLoading) return <p className="text-muted">Loading cities…</p>

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-paper">Cities</h1>
        <span className="text-sm text-muted tabular-nums">{filtered.length.toLocaleString()}</span>
      </div>

      <input
        type="search"
        placeholder="Search cities…"
        value={q}
        onChange={e => handleSearch(e.target.value)}
        className="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
      />

      <div className="divide-y divide-edge">
        {paged.map((c, i) => (
          <Link
            key={i}
            to={`/shows?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state ?? '')}`}
            className="flex items-center justify-between py-3 group"
          >
            <div>
              <p className="text-paper group-hover:text-accent transition-colors">
                {c.city}{c.state ? `, ${c.state}` : ''}
              </p>
              <p className="text-sm text-muted">{c.country}</p>
            </div>
            <span className="text-accent text-sm tabular-nums ml-4 shrink-0">{c.show_count} shows</span>
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
