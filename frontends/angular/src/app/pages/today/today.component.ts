import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import type { ShowSummary } from '../../lib/data'

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <div class="mb-8">
        <h1 class="font-serif text-3xl font-bold text-paper mb-1">Today in Dead History</h1>
        <p class="text-muted text-sm">{{ todayLabel() }}</p>
      </div>

      @if (isLoading()) {
        <p class="text-muted">Loading…</p>
      } @else if (todayShows().length === 0) {
        <p class="text-muted py-10 text-center">No shows on this date in history.</p>
      } @else {
        @if (featured()) {
          <div class="border-l-2 border-accent pl-6 mb-10">
            <p class="text-xs text-muted mb-1">{{ featured()!.date }}</p>
            <h2 class="font-serif text-2xl font-bold text-paper mb-1">
              <a [routerLink]="['/shows', featured()!.uuid]" class="hover:text-accent transition-colors">
                {{ featured()!.venue }}
              </a>
            </h2>
            <p class="text-muted text-sm">
              {{ featured()!.city }}{{ featured()!.state ? ', ' + featured()!.state : '' }}
            </p>
          </div>
        }

        @if (others().length > 0) {
          <h3 class="text-xs text-muted tracking-wide mb-4">Other shows on this date</h3>
          <div class="divide-y divide-edge">
            @for (show of others(); track show.uuid) {
              <div class="flex items-center gap-4 py-3 text-sm">
                <span class="font-mono text-muted w-24 shrink-0 tabular-nums">{{ show.date }}</span>
                <a [routerLink]="['/shows', show.uuid]" class="flex-1 text-paper hover:text-accent transition-colors">
                  {{ show.venue }}
                </a>
                <span class="text-muted shrink-0">{{ show.city }}{{ show.state ? ', ' + show.state : '' }}</span>
              </div>
            }
          </div>
        }
      }
    </div>
  `,
})
export class TodayComponent implements OnInit {
  private http = inject(HttpClient)

  private readonly seed = Math.random()
  private readonly now = new Date()

  readonly isLoading = signal(true)
  readonly allShows = signal<ShowSummary[]>([])

  readonly todayShows = computed(() => {
    const m = this.now.getMonth() + 1
    const d = this.now.getDate()
    return this.allShows().filter(s => s.month === m && s.day === d)
  })

  readonly featuredIndex = computed(() =>
    this.todayShows().length > 0
      ? Math.floor(this.seed * this.todayShows().length)
      : 0
  )

  readonly featured = computed(() => this.todayShows()[this.featuredIndex()] ?? null)
  readonly others = computed(() =>
    this.todayShows().filter((_, i) => i !== this.featuredIndex())
  )

  readonly todayLabel = computed(() => {
    const month = this.now.toLocaleString('default', { month: 'long' })
    const day = this.now.getDate()
    return `${month} ${day} — ${this.todayShows().length} show${this.todayShows().length !== 1 ? 's' : ''} in history`
  })

  ngOnInit(): void {
    this.http.get<ShowSummary[]>('/data/shows/index.json').subscribe({
      next: data => { this.allShows.set(data); this.isLoading.set(false) },
      error: () => this.isLoading.set(false),
    })
  }
}
