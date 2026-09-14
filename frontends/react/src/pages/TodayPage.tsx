import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { fetchShows } from '@/lib/data'

export default function TodayPage() {
  const { data: shows = [], isLoading } = useQuery({
    queryKey: ['shows'],
    queryFn: fetchShows,
  })

  const now = new Date()
  const month = now.getMonth() + 1
  const day = now.getDate()

  const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

  const todayShows = useMemo(
    () => shows.filter(s => s.month === month && s.day === day).sort((a, b) => a.year - b.year),
    [shows, month, day]
  )

  // Pick a random featured show once — stable across re-renders
  const [seed] = useState(() => Math.random())
  const featuredIndex = todayShows.length > 0
    ? Math.floor(seed * todayShows.length)
    : 0
  const featured = todayShows[featuredIndex] ?? null
  const others = todayShows.filter((_, i) => i !== featuredIndex)

  if (isLoading) return <p className="text-muted">Loading…</p>

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-muted mb-1 font-sans tracking-wide">Today in Dead History</p>
      <h1 className="font-serif text-4xl font-bold text-paper mb-10">{dateLabel}</h1>

      {todayShows.length === 0 ? (
        <p className="text-muted">No shows on this date in the archive.</p>
      ) : (
        <>
          {/* Featured show */}
          <div className="mb-10 border-l-2 border-accent pl-5 py-1">
            <p className="font-mono text-accent text-sm mb-2">{featured?.date}</p>
            <Link
              to={`/shows/${featured?.uuid}`}
              className="font-serif text-2xl font-semibold text-paper hover:text-accent-hi transition-colors leading-tight"
            >
              {featured?.venue}
            </Link>
            <p className="text-muted mt-2 text-sm">
              {featured?.city}{featured?.state ? `, ${featured.state}` : ''} · {featured?.country}
            </p>
            <Link
              to={`/shows/${featured?.uuid}`}
              className="inline-block mt-4 text-sm text-accent hover:text-accent-hi transition-colors"
            >
              View full setlist →
            </Link>
          </div>

          {/* Other shows on this date */}
          {others.length > 0 && (
            <div>
              <p className="text-sm text-muted mb-4">
                {todayShows.length === 2 ? '1 other show' : `${others.length} other shows`} on {dateLabel}
              </p>
              <div className="divide-y divide-edge">
                {others.map(show => (
                  <div key={show.uuid} className="flex items-baseline gap-4 py-3 group">
                    <span className="font-mono text-muted text-sm w-20 shrink-0">{show.date}</span>
                    <div>
                      <Link
                        to={`/shows/${show.uuid}`}
                        className="text-paper hover:text-accent transition-colors"
                      >
                        {show.venue}
                      </Link>
                      <span className="text-muted text-sm ml-3">
                        {show.city}{show.state ? `, ${show.state}` : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
