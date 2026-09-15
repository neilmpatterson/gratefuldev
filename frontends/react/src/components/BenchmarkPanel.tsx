import { useState, useEffect, useRef } from 'react'

const isProd = import.meta.env.PROD
const PAGES = 'https://neilmpatterson.github.io/gratefuldev'

const OTHER_FRONTENDS = isProd
  ? [
      { label: 'Dashboard', href: `${PAGES}/` },
      { label: 'Vue 3', href: `${PAGES}/vue/` },
      { label: 'Angular', href: `${PAGES}/angular/` },
    ]
  : [
      { label: 'Vue 3', href: 'http://localhost:5174' },
      { label: 'Angular', href: 'http://localhost:5175' },
      { label: 'Rails + Hotwire', href: 'http://localhost:3001' },
    ]

interface Metrics {
  loadMs: number | null
  jsKb: number | null
  cssKb: number | null
  fetchMs: number | null
}

function measure(): Metrics {
  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  const jsKb = res
    .filter(r => r.initiatorType === 'script' && r.transferSize > 0)
    .reduce((sum, r) => sum + r.transferSize, 0) / 1024

  const cssKb = res
    .filter(r => r.initiatorType === 'link' && r.name.endsWith('.css') && r.transferSize > 0)
    .reduce((sum, r) => sum + r.transferSize, 0) / 1024

  const shows = res.find(r => r.name.includes('shows/index.json') && r.duration > 0)

  return {
    loadMs: nav ? Math.round(nav.loadEventEnd) : null,
    // bundle sizes are only meaningful in a production build
    jsKb: isProd && jsKb > 0 ? Math.round(jsKb) : null,
    cssKb: isProd && cssKb > 0 ? Math.round(cssKb) : null,
    fetchMs: shows ? Math.round(shows.duration) : null,
  }
}

const PATTERNS = [
  {
    label: 'Data caching',
    detail:
      'TanStack Query — useQuery with staleTime: Infinity. Cached by key, concurrent requests deduplicated automatically. No manual load-once guard.',
  },
  {
    label: 'Derived state',
    detail:
      'useMemo with explicit dependency arrays. React reruns the memo only when listed deps change.',
  },
  {
    label: 'URL sync',
    detail:
      'useSearchParams + useEffect([searchParams]) re-syncs filter state when arriving via city or venue links.',
  },
  {
    label: 'Active nav',
    detail:
      "NavLink's className render prop receives isActive directly from React Router — no manual path comparison.",
  },
  {
    label: 'Component API',
    detail:
      'className passed as a prop. Logo and similar components must forward it explicitly to their root element.',
  },
]

function Row({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="flex items-baseline justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-paper tabular-nums">
        {value}
        {note && <span className="text-muted text-xs ml-1">({note})</span>}
      </span>
    </div>
  )
}

export default function BenchmarkPanel() {
  const [open, setOpen] = useState(false)
  const [metrics, setMetrics] = useState<Metrics>({ loadMs: null, jsKb: null, cssKb: null, fetchMs: null })
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) setMetrics(measure())
  }, [open])

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  return (
    <div ref={ref} className="relative ml-auto shrink-0">
      <button
        onClick={() => setOpen(o => !o)}
        className={`flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors ${
          open ? 'text-accent' : 'text-muted hover:text-paper'
        }`}
      >
        React
        <span className="text-xs opacity-60">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-surface border border-edge rounded-lg shadow-2xl z-50 p-5 text-sm">

          {/* Identity */}
          <div className="mb-5">
            <p className="text-paper font-semibold text-base">React 19</p>
            <p className="text-muted text-xs mt-1">TanStack Query 5 · React Router 7 · Tailwind 4</p>
          </div>

          {/* Metrics */}
          <div className="mb-5">
            <p className="text-xs text-muted tracking-wide mb-3">Performance</p>
            <div className="space-y-1.5">
              <Row label="Page load" value={metrics.loadMs != null ? `${metrics.loadMs} ms` : '—'} />
              <Row
                label="JS bundle"
                value={metrics.jsKb != null ? `${metrics.jsKb} KB` : 'dev'}
                note={metrics.jsKb != null ? 'gzip' : undefined}
              />
              <Row
                label="CSS bundle"
                value={metrics.cssKb != null ? `${metrics.cssKb} KB` : 'dev'}
                note={metrics.cssKb != null ? 'gzip' : undefined}
              />
              <Row
                label="Shows fetch"
                value={metrics.fetchMs != null ? `${metrics.fetchMs} ms` : '—'}
                note="2,358 shows"
              />
            </div>
          </div>

          {/* Patterns */}
          <div className="mb-5">
            <p className="text-xs text-muted tracking-wide mb-3">Key patterns</p>
            <div className="space-y-3">
              {PATTERNS.map(p => (
                <div key={p.label}>
                  <p className="text-xs text-accent mb-0.5">{p.label}</p>
                  <p className="text-xs text-muted leading-relaxed">{p.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other frontends */}
          <div className="border-t border-edge pt-4">
            <p className="text-xs text-muted mb-2">Also in this project</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs">
              {OTHER_FRONTENDS.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-accent hover:text-accent-hi transition-colors"
                  target="_blank"
                  rel="noreferrer"
                >
                  {label} →
                </a>
              ))}
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
