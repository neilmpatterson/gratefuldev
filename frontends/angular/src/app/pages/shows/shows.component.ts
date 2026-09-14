import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { ShowsService } from '../../services/shows.service'
import { applySearch } from '../../lib/parse-search'
import { PaginationComponent } from '../../components/pagination.component'

const SELECT_CLASS = 'bg-surface border border-edge rounded px-3 py-1.5 text-sm text-paper focus:outline-none focus:border-accent'

@Component({
  selector: 'app-shows',
  standalone: true,
  imports: [RouterLink, PaginationComponent],
  template: `
    <div>
      <div class="flex items-baseline justify-between mb-6">
        <h1 class="font-serif text-3xl font-bold text-paper">Shows</h1>
        <span class="text-sm text-muted tabular-nums">{{ filtered().length.toLocaleString() }}</span>
      </div>

      <input
        type="search"
        placeholder="Search by venue, city, year (1977), or date (7/4/1995)…"
        [value]="q()"
        (input)="handleSearch($any($event.target).value)"
        class="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-3 focus:outline-none focus:border-accent"
      />

      <div class="flex flex-wrap gap-2 mb-8">
        <select [value]="year()" (change)="handleYear($any($event.target).value)" [class]="selectClass">
          <option value="">All years</option>
          @for (y of years(); track y) {
            <option [value]="y">{{ y }}</option>
          }
        </select>
        <select [value]="state()" (change)="handleState($any($event.target).value)" [class]="selectClass">
          <option value="">All states</option>
          @for (s of states(); track s) {
            <option [value]="s">{{ s }}</option>
          }
        </select>
        <select [value]="city()" (change)="handleCity($any($event.target).value)" [class]="selectClass">
          <option value="">All cities</option>
          @for (c of cities(); track c) {
            <option [value]="c">{{ c }}</option>
          }
        </select>
        <select [value]="venue()" (change)="handleVenue($any($event.target).value)" [class]="selectClass">
          <option value="">All venues</option>
          @for (v of venues(); track v) {
            <option [value]="v">{{ v }}</option>
          }
        </select>
        @if (hasFilters()) {
          <button (click)="reset()" class="text-sm text-muted hover:text-paper transition-colors px-2">
            Clear filters
          </button>
        }
      </div>

      <div class="divide-y divide-edge">
        @for (show of paged(); track show.uuid) {
          <div class="flex items-center gap-4 py-3 text-sm">
            <span class="font-mono text-muted w-24 shrink-0 tabular-nums">{{ show.date }}</span>
            <a [routerLink]="['/shows', show.uuid]" class="flex-1 text-paper hover:text-accent transition-colors">
              {{ show.venue }}
            </a>
            <a
              [routerLink]="['/shows']"
              [queryParams]="{ city: show.city, state: show.state ?? '' }"
              class="text-muted hover:text-accent transition-colors shrink-0 text-right"
            >
              {{ show.city }}{{ show.state ? ', ' + show.state : '' }}
            </a>
          </div>
        }
        @if (paged().length === 0) {
          <p class="text-muted py-10 text-center">No shows match.</p>
        }
      </div>

      <app-pagination
        [page]="page()"
        [pageCount]="pageCount()"
        [pageSize]="pageSize()"
        (pageChange)="page.set($event)"
        (pageSizeChange)="setPageSize($event)"
      />
    </div>
  `,
})
export class ShowsComponent implements OnInit {
  private route = inject(ActivatedRoute)
  protected showsService = inject(ShowsService)

  readonly q = signal('')
  readonly year = signal('')
  readonly state = signal('')
  readonly city = signal('')
  readonly venue = signal('')
  readonly page = signal(1)
  readonly pageSize = signal(15)

  readonly selectClass = SELECT_CLASS

  readonly years = computed(() =>
    [...new Set(this.showsService.shows().map(s => s.year))].sort()
  )

  readonly states = computed(() => {
    const src = this.year()
      ? this.showsService.shows().filter(s => s.year === Number(this.year()))
      : this.showsService.shows()
    return [...new Set(src.map(s => s.state).filter(Boolean))].sort()
  })

  readonly cities = computed(() => {
    const src = this.showsService.shows().filter(s =>
      (!this.year() || s.year === Number(this.year())) &&
      (!this.state() || s.state === this.state())
    )
    return [...new Set(src.map(s => s.city).filter(Boolean))].sort()
  })

  readonly venues = computed(() => {
    const src = this.showsService.shows().filter(s =>
      (!this.year() || s.year === Number(this.year())) &&
      (!this.state() || s.state === this.state()) &&
      (!this.city() || s.city === this.city())
    )
    return [...new Set(src.map(s => s.venue).filter(Boolean))].sort()
  })

  readonly filtered = computed(() => {
    const byDropdowns = this.showsService.shows().filter(s =>
      (!this.year() || s.year === Number(this.year())) &&
      (!this.state() || s.state === this.state()) &&
      (!this.city() || s.city === this.city()) &&
      (!this.venue() || s.venue === this.venue())
    )
    return applySearch(byDropdowns, this.q())
  })

  readonly pageCount = computed(() => Math.ceil(this.filtered().length / this.pageSize()))
  readonly paged = computed(() =>
    this.filtered().slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize())
  )
  readonly hasFilters = computed(() =>
    !!(this.q() || this.year() || this.state() || this.city() || this.venue())
  )

  ngOnInit(): void {
    this.showsService.load()
    this.route.queryParams.subscribe(params => {
      this.q.set(params['q'] ?? '')
      this.year.set(params['year'] ?? '')
      this.state.set(params['state'] ?? '')
      this.city.set(params['city'] ?? '')
      this.venue.set(params['venue'] ?? '')
      this.page.set(1)
    })
  }

  reset(): void {
    this.q.set(''); this.year.set(''); this.state.set(''); this.city.set(''); this.venue.set(''); this.page.set(1)
  }

  handleYear(v: string): void { this.year.set(v); this.state.set(''); this.city.set(''); this.venue.set(''); this.page.set(1) }
  handleState(v: string): void { this.state.set(v); this.city.set(''); this.venue.set(''); this.page.set(1) }
  handleCity(v: string): void { this.city.set(v); this.venue.set(''); this.page.set(1) }
  handleVenue(v: string): void { this.venue.set(v); this.page.set(1) }
  handleSearch(v: string): void { this.q.set(v); this.page.set(1) }
  setPageSize(n: number): void { this.pageSize.set(n); this.page.set(1) }
}
