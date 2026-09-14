import { Component, OnInit, inject, signal, computed } from '@angular/core'
import { RouterLink } from '@angular/router'
import { SongsService } from '../../services/songs.service'
import { PaginationComponent } from '../../components/pagination.component'

@Component({
  selector: 'app-songs',
  standalone: true,
  imports: [RouterLink, PaginationComponent],
  template: `
    <div>
      <div class="flex items-baseline justify-between mb-6">
        <h1 class="font-serif text-3xl font-bold text-paper">Songs</h1>
        <span class="text-sm text-muted tabular-nums">{{ filtered().length.toLocaleString() }}</span>
      </div>

      <input
        type="search"
        placeholder="Search songs…"
        [value]="q()"
        (input)="handleSearch($any($event.target).value)"
        class="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
      />

      <div class="divide-y divide-edge">
        @for (song of paged(); track song.uuid) {
          <a
            [routerLink]="['/songs', song.uuid]"
            class="flex items-center justify-between py-3 text-paper hover:text-accent transition-colors group"
          >
            <span>{{ song.name }}</span>
            <span class="text-sm text-muted group-hover:text-accent transition-colors tabular-nums">
              {{ song.times_played }}×
            </span>
          </a>
        }
        @if (paged().length === 0) {
          <p class="text-muted py-10 text-center">No songs match.</p>
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
export class SongsComponent implements OnInit {
  private songsService = inject(SongsService)

  readonly q = signal('')
  readonly page = signal(1)
  readonly pageSize = signal(15)

  readonly filtered = computed(() => {
    const term = this.q().toLowerCase().trim()
    if (!term) return this.songsService.songs()
    return this.songsService.songs().filter(s => s.name.toLowerCase().includes(term))
  })

  readonly pageCount = computed(() => Math.ceil(this.filtered().length / this.pageSize()))
  readonly paged = computed(() =>
    this.filtered().slice((this.page() - 1) * this.pageSize(), this.page() * this.pageSize())
  )

  ngOnInit(): void {
    this.songsService.load()
  }

  handleSearch(v: string): void { this.q.set(v); this.page.set(1) }
  setPageSize(n: number): void { this.pageSize.set(n); this.page.set(1) }
}
