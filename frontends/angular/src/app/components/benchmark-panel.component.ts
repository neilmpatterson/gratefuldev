import { Component, signal, computed, HostListener, ElementRef } from '@angular/core'

const isProd = import.meta.env.PROD
const PAGES = 'https://neilmpatterson.github.io/gratefuldev'

const OTHER_FRONTENDS = isProd
  ? [
      { label: 'Dashboard', href: `${PAGES}/` },
      { label: 'React 19', href: `${PAGES}/react/` },
      { label: 'Vue 3', href: `${PAGES}/vue/` },
    ]
  : [
      { label: 'React 19', href: 'http://localhost:5173' },
      { label: 'Vue 3', href: 'http://localhost:5174' },
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
    jsKb: isProd && jsKb > 0 ? Math.round(jsKb) : null,
    cssKb: isProd && cssKb > 0 ? Math.round(cssKb) : null,
    fetchMs: shows ? Math.round(shows.duration) : null,
  }
}

const PATTERNS = [
  {
    label: 'Data caching',
    detail:
      'Injectable service with signal<T[]>() — load() checks shows().length > 0 before fetching. Load-once cache with no external library, just RxJS HttpClient.',
  },
  {
    label: 'Derived state',
    detail:
      'computed() signals — auto-tracks reactive signal dependencies, same concept as Vue computed(). Recomputes only when accessed signals change.',
  },
  {
    label: 'URL sync',
    detail:
      'ActivatedRoute.queryParams Observable — subscribe in ngOnInit, fires on every navigation including router.navigate() from other pages.',
  },
  {
    label: 'Detail pages',
    detail:
      'ActivatedRoute.paramMap + switchMap — cancels inflight HTTP requests when UUID changes mid-navigation. RxJS pipeline, no manual cleanup.',
  },
  {
    label: 'Active nav',
    detail:
      'RouterLinkActive directive with template reference (#link="routerLinkActive") — reads link.isActive in the template to toggle classes. Angular built-in.',
  },
  {
    label: 'Component API',
    detail:
      'input() / output() signal functions (Angular 17+) — the new signal-based API replaces @Input() / @Output() decorators. Type-safe and reactive.',
  },
]

@Component({
  selector: 'app-benchmark-panel',
  standalone: true,
  host: { class: 'ml-auto shrink-0 relative block' },
  template: `
    <button
      (click)="toggleOpen()"
      [class]="open() ? 'flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors text-accent'
                      : 'flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors text-muted hover:text-paper'"
    >
      Angular
      <span class="text-xs opacity-60">{{ open() ? '▲' : '▼' }}</span>
    </button>

    @if (open()) {
      <div class="absolute right-0 top-full mt-2 w-96 bg-surface border border-edge rounded-lg shadow-2xl z-50 p-5 text-sm">

        <div class="mb-5">
          <p class="text-paper font-semibold text-base">Angular 18</p>
          <p class="text-muted text-xs mt-1">RxJS 7 · Angular Router · Tailwind 4</p>
        </div>

        <div class="mb-5">
          <p class="text-xs text-muted tracking-wide mb-3">Performance</p>
          <div class="space-y-1.5">
            <div class="flex items-baseline justify-between">
              <span class="text-muted">Page load</span>
              <span class="text-paper tabular-nums">{{ metrics().loadMs != null ? metrics().loadMs + ' ms' : '—' }}</span>
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-muted">JS bundle</span>
              <span class="text-paper tabular-nums">
                {{ metrics().jsKb != null ? metrics().jsKb + ' KB' : 'dev' }}
                @if (metrics().jsKb != null) {
                  <span class="text-muted text-xs ml-1">(gzip)</span>
                }
              </span>
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-muted">CSS bundle</span>
              <span class="text-paper tabular-nums">
                {{ metrics().cssKb != null ? metrics().cssKb + ' KB' : 'dev' }}
                @if (metrics().cssKb != null) {
                  <span class="text-muted text-xs ml-1">(gzip)</span>
                }
              </span>
            </div>
            <div class="flex items-baseline justify-between">
              <span class="text-muted">Shows fetch</span>
              <span class="text-paper tabular-nums">
                {{ metrics().fetchMs != null ? metrics().fetchMs + ' ms' : '—' }}
                <span class="text-muted text-xs ml-1">(2,358 shows)</span>
              </span>
            </div>
          </div>
        </div>

        <div class="mb-5">
          <p class="text-xs text-muted tracking-wide mb-3">Key patterns</p>
          <div class="space-y-3">
            @for (p of patterns; track p.label) {
              <div>
                <p class="text-xs text-accent mb-0.5">{{ p.label }}</p>
                <p class="text-xs text-muted leading-relaxed">{{ p.detail }}</p>
              </div>
            }
          </div>
        </div>

        <div class="border-t border-edge pt-4">
          <p class="text-xs text-muted mb-2">Also in this project</p>
          <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs">
            @for (f of otherFrontends; track f.label) {
              <a [href]="f.href" class="text-accent hover:text-accent-hi transition-colors" target="_blank" rel="noreferrer">{{ f.label }} →</a>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class BenchmarkPanelComponent {
  private el: ElementRef

  readonly open = signal(false)
  readonly metrics = computed<Metrics>(() =>
    this.open() ? measure() : { loadMs: null, jsKb: null, cssKb: null, fetchMs: null }
  )
  readonly patterns = PATTERNS
  readonly otherFrontends = OTHER_FRONTENDS

  constructor(el: ElementRef) {
    this.el = el
  }

  toggleOpen(): void {
    this.open.update(v => !v)
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(e: Event): void {
    if (this.open() && !this.el.nativeElement.contains(e.target)) {
      this.open.set(false)
    }
  }
}
