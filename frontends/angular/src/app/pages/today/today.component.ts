import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import type { ShowSummary } from '../../lib/data'
import { DATA_BASE } from '../../../environment'

@Component({
  selector: 'app-today',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isLoading()) {
      <p class="text-muted">Loading…</p>
    } @else {
      <div class="max-w-2xl">
        <p class="text-sm text-muted mb-1 font-sans tracking-wide">Today in Dead History</p>
        <h1 class="font-serif text-4xl font-bold text-paper mb-10">{{ dateLabel() }}</h1>

        @if (todayShows().length === 0) {
          <p class="text-muted">No shows on this date in the archive.</p>
        } @else {
          <!-- Featured show -->
          <div class="mb-10 border-l-2 border-accent pl-5 py-1">
            <p class="font-mono text-accent text-sm mb-2">{{ featured()!.date }}</p>
            <a
              [routerLink]="['/shows', featured()!.uuid]"
              class="font-serif text-2xl font-semibold text-paper hover:text-accent-hi transition-colors leading-tight"
            >
              {{ featured()!.venue }}
            </a>
            <p class="text-muted mt-2 text-sm">
              {{ featured()!.city }}{{ featured()!.state ? ', ' + featured()!.state : '' }} · {{ featured()!.country }}
            </p>
            <a
              [routerLink]="['/shows', featured()!.uuid]"
              class="inline-block mt-4 text-sm text-accent hover:text-accent-hi transition-colors"
            >
              View full setlist →
            </a>
          </div>

          <!-- Other shows -->
          @if (others().length > 0) {
            <div>
              <p class="text-sm text-muted mb-4">
                {{ todayShows().length === 2 ? '1 other show' : others().length + ' other shows' }} on {{ dateLabel() }}
              </p>
              <div class="divide-y divide-edge">
                @for (show of others(); track show.uuid) {
                  <div class="flex items-baseline gap-4 py-3 group">
                    <span class="font-mono text-muted text-sm w-20 shrink-0">{{ show.date }}</span>
                    <div>
                      <a
                        [routerLink]="['/shows', show.uuid]"
                        class="text-paper hover:text-accent transition-colors"
                      >{{ show.venue }}</a>
                      <span class="text-muted text-sm ml-3">
                        {{ show.city }}{{ show.state ? ', ' + show.state : '' }}
                      </span>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    }
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
    return this.allShows()
      .filter(s => s.month === m && s.day === d)
      .sort((a, b) => a.year - b.year)
  })

  readonly featuredIndex = computed(() =>
    this.todayShows().length > 0 ? Math.floor(this.seed * this.todayShows().length) : 0
  )

  readonly featured = computed(() => this.todayShows()[this.featuredIndex()] ?? null)
  readonly others = computed(() =>
    this.todayShows().filter((_, i) => i !== this.featuredIndex())
  )

  readonly dateLabel = computed(() =>
    this.now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })
  )

  ngOnInit(): void {
    this.http.get<ShowSummary[]>(`${DATA_BASE}/shows/index.json`).subscribe({
      next: data => { this.allShows.set(data); this.isLoading.set(false) },
      error: () => this.isLoading.set(false),
    })
  }
}
