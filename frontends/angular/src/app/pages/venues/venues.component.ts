import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { RouterLink } from '@angular/router'
import { VenuesService } from '../../services/venues.service'
import { PaginationComponent } from '../../components/pagination.component'

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [RouterLink, PaginationComponent],
  template: `
    <div>
      <div class="flex items-baseline justify-between mb-6">
        <h1 class="font-serif text-3xl font-bold text-paper">Venues</h1>
        <span class="text-sm text-muted tabular-nums">{{ filtered().length.toLocaleString() }}</span>
      </div>

      <input
        type="search"
        placeholder="Search venues…"
        [value]="q()"
        (input)="handleSearch($any($event.target).value)"
        class="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
      />

      @if (venuesService.isLoading()) {
        <p class="text-muted">Loading…</p>
      } @else {
        <div class="divide-y divide-edge">
          @for (v of paged(); track v.venue + v.city) {
            <a
              [routerLink]="['/shows']"
              [queryParams]="{ venue: v.venue, city: v.city, state: v.state ?? '' }"
              class="flex items-center justify-between py-3 group"
            >
              <div>
                <p class="text-paper group-hover:text-accent transition-colors">{{ v.venue }}</p>
                <p class="text-sm text-muted">{{ v.city }}{{ v.state ? ', ' + v.state : '' }} · {{ v.country }}</p>
              </div>
              <span class="text-accent text-sm tabular-nums ml-4 shrink-0">{{ v.show_count }} shows</span>
            </a>
          }
        </div>

        <app-pagination
          [page]="page()"
          [pageCount]="pageCount()"
          [pageSize]="pageSize()"
          (pageChange)="page.set($event)"
          (pageSizeChange)="setPageSize($event)"
        />
      }
    </div>
  `,
})
export class VenuesComponent implements OnInit {
  protected venuesService = inject(VenuesService)

  readonly q = signal('')
  readonly page = signal(1)
  readonly pageSize = signal(15)

  readonly filtered = computed(() => {
    const sorted = [...this.venuesService.venues()].sort((a, b) => b.show_count - a.show_count)
    const term = this.q().toLowerCase().trim()
    if (!term) return sorted
    return sorted.filter(v =>
      v.venue?.toLowerCase().includes(term) ||
      v.city?.toLowerCase().includes(term) ||
      v.state?.toLowerCase().includes(term)
    )
  })

  readonly pageCount = computed(() => Math.ceil(this.filtered().length / this.pageSize()))
  readonly paged = computed(() =>
    this.filtered().slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize())
  )

  ngOnInit(): void {
    this.venuesService.load()
  }

  handleSearch(v: string): void { this.q.set(v); this.page.set(1) }
  setPageSize(n: number): void { this.pageSize.set(n); this.page.set(1) }
}
