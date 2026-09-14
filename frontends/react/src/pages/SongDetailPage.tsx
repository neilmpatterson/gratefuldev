import { useQuery } from '@tanstack/react-query'
import { useParams, Link } from 'react-router-dom'
import { fetchSong } from '@/lib/data'

export default function SongDetailPage() {
  const { uuid } = useParams<{ uuid: string }>()
  const { data: song, isLoading } = useQuery({
    queryKey: ['song', uuid],
    queryFn: () => fetchSong(uuid!),
    enabled: !!uuid,
  })

  if (isLoading) return <p className="text-muted">Loading…</p>
  if (!song) return <p className="text-muted">Song not found.</p>

  return (
    <div className="max-w-2xl">
      <Link to="/songs" className="text-sm text-muted hover:text-paper transition-colors mb-8 inline-block">
        ← All songs
      </Link>

      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-paper">{song.name}</h1>
        <p className="text-accent mt-2 text-sm tabular-nums">{song.times_played} performances</p>
      </div>

      <p className="text-xs text-muted tracking-widest mb-4">Shows</p>
      <div className="divide-y divide-edge">
        {song.shows.map(show => (
          <Link
            key={show.uuid}
            to={`/shows/${show.uuid}`}
            className="flex items-center gap-4 py-3 group text-sm"
          >
            <span className="font-mono text-muted w-24 shrink-0 tabular-nums group-hover:text-accent transition-colors">
              {show.date}
            </span>
            <span className="flex-1 text-paper group-hover:text-accent transition-colors">
              {show.venue}
            </span>
            <span className="text-muted text-right shrink-0">
              {show.city}{show.state ? `, ${show.state}` : ''}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
