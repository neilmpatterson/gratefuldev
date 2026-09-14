import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { fetchShow } from '@/lib/data'

export default function ShowDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: show, isLoading } = useQuery({
    queryKey: ['show', uuid],
    queryFn: () => fetchShow(uuid!),
    enabled: !!uuid,
  })

  if (isLoading) return <p className="text-muted">Loading…</p>
  if (!show) return <p className="text-muted">Show not found.</p>

  return (
    <div className="max-w-2xl">
      <Link to="/shows" className="text-sm text-muted hover:text-paper transition-colors mb-8 inline-block">
        ← All shows
      </Link>

      <div className="mb-10">
        <p className="font-mono text-accent text-sm mb-2">{show.date}</p>
        <h1 className="font-serif text-3xl font-bold text-paper leading-tight">{show.venue}</h1>
        <p className="text-muted mt-2">
          {show.city}{show.state ? `, ${show.state}` : ''} · {show.country}
        </p>
      </div>

      {show.sets.map(set => (
        <div key={set.uuid} className="mb-10">
          <p className="text-xs text-muted tracking-widest mb-4 font-sans">
            {set.encore ? 'Encore' : `Set ${set.position + 1}`}
          </p>
          <ol className="space-y-1.5">
            {set.songs.map((song, j) => (
              <li key={song.uuid} className="flex items-baseline gap-3 group">
                <span className="text-muted text-xs w-5 text-right shrink-0 tabular-nums">{j + 1}</span>
                <span className="flex-1 flex items-baseline gap-1.5 min-w-0">
                  <Link
                    to={`/songs/${song.song_ref_uuid}`}
                    className="text-paper hover:text-accent transition-colors"
                  >
                    {song.name}
                  </Link>
                  {song.segued && (
                    <span className="text-accent font-semibold text-base leading-none shrink-0">&gt;</span>
                  )}
                </span>
                <span className="text-muted text-xs tabular-nums shrink-0">{song.times_played}×</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  )
}
