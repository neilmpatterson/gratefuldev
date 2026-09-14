import { Component, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { switchMap, map } from 'rxjs'
import type { ShowDetail } from '../../lib/data'

@Component({
  selector: 'app-show-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isLoading()) {
      <p class="text-muted">Loading…</p>
    } @else if (show()) {
      <div>
        <div class="mb-8">
          <p class="font-mono text-muted text-sm mb-1">{{ show()!.date }}</p>
          <h1 class="font-serif text-3xl font-bold text-paper mb-1">{{ show()!.venue }}</h1>
          <p class="text-muted">
            <a
              [routerLink]="['/shows']"
              [queryParams]="{ city: show()!.city, state: show()!.state ?? '' }"
              class="hover:text-accent transition-colors"
            >
              {{ show()!.city }}{{ show()!.state ? ', ' + show()!.state : '' }}
            </a>
          </p>
        </div>

        @for (set of show()!.sets; track set.uuid) {
          <div class="mb-8">
            <h2 class="text-xs text-muted tracking-wide mb-3">
              {{ set.encore ? 'Encore' : 'Set ' + set.position }}
            </h2>
            <div class="space-y-0">
              @for (song of set.songs; track song.uuid) {
                <div class="flex items-baseline gap-1 py-1.5 border-b border-edge last:border-0">
                  <span class="text-muted text-xs w-6 shrink-0 tabular-nums">{{ song.position }}.</span>
                  <span class="flex-1 flex items-baseline gap-1.5 min-w-0">
                    <a
                      [routerLink]="['/songs', song.song_ref_uuid]"
                      class="text-paper hover:text-accent transition-colors"
                    >
                      {{ song.name }}
                    </a>
                    @if (song.segued) {
                      <span class="text-accent font-semibold text-base leading-none shrink-0">&gt;</span>
                    }
                  </span>
                  <span class="text-muted text-xs shrink-0 tabular-nums">×{{ song.times_played }}</span>
                </div>
              }
            </div>
          </div>
        }
      </div>
    } @else {
      <p class="text-muted">Show not found.</p>
    }
  `,
})
export class ShowDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)

  readonly show = signal<ShowDetail | null>(null)
  readonly isLoading = signal(true)

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('uuid')!),
      switchMap(uuid => {
        this.isLoading.set(true)
        return this.http.get<ShowDetail>(`/data/shows/${uuid}.json`)
      })
    ).subscribe({
      next: data => { this.show.set(data); this.isLoading.set(false) },
      error: () => { this.show.set(null); this.isLoading.set(false) },
    })
  }
}
