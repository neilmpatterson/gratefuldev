import { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchSongs } from '@/lib/data'
import Pagination from '@/components/Pagination'

export default function SongsPage() {
  const { data: songs = [], isLoading } = useQuery({
    queryKey: ['songs'],
    queryFn: fetchSongs,
  })

  const [q, setQ] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(15)

  const filtered = useMemo(() => {
    if (!q) return songs
    return songs.filter(s => s.name.toLowerCase().includes(q.toLowerCase()))
  }, [songs, q])

  const pageCount = Math.ceil(filtered.length / pageSize)
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize)

  function handleSearch(v: string) { setQ(v); setPage(1) }
  function handlePageSize(n: number) { setPageSize(n); setPage(1) }

  if (isLoading) return <p className="text-muted">Loading songs…</p>

  return (
    <div>
      <div className="flex items-baseline justify-between mb-6">
        <h1 className="font-serif text-3xl font-bold text-paper">Songs</h1>
        <span className="text-sm text-muted tabular-nums">{filtered.length.toLocaleString()}</span>
      </div>

      <input
        type="search"
        placeholder="Search songs…"
        value={q}
        onChange={e => handleSearch(e.target.value)}
        className="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
      />

      <div className="divide-y divide-edge">
        {paged.map(song => (
          <Link
            key={song.uuid}
            to={`/songs/${song.uuid}`}
            className="flex items-center justify-between py-3 text-paper hover:text-accent transition-colors group"
          >
            <span>{song.name}</span>
            <span className="text-sm text-muted group-hover:text-accent transition-colors tabular-nums">
              {song.times_played}×
            </span>
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
