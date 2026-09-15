import { Component, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { switchMap, map } from 'rxjs'
import type { ShowDetail } from '../../lib/data'
import { DATA_BASE } from '../../../environment'

@Component({
  selector: 'app-show-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isLoading()) {
      <p class="text-muted">Loading…</p>
    } @else if (show()) {
      <div class="max-w-2xl">
        <a routerLink="/shows" class="text-sm text-muted hover:text-paper transition-colors mb-8 inline-block">
          ← All shows
        </a>

        <div class="mb-10">
          <p class="font-mono text-accent text-sm mb-2">{{ show()!.date }}</p>
          <h1 class="font-serif text-3xl font-bold text-paper leading-tight">{{ show()!.venue }}</h1>
          <p class="text-muted mt-2">
            {{ show()!.city }}{{ show()!.state ? ', ' + show()!.state : '' }} · {{ show()!.country }}
          </p>
        </div>

        @for (set of show()!.sets; track set.uuid; let si = $index) {
          <div class="mb-10">
            <p class="text-xs text-muted tracking-widest mb-4 font-sans">
              {{ set.encore ? 'Encore' : 'Set ' + (set.position + 1) }}
            </p>
            <ol class="space-y-1.5">
              @for (song of set.songs; track song.uuid; let j = $index) {
                <li class="flex items-baseline gap-3 group">
                  <span class="text-muted text-xs w-5 text-right shrink-0 tabular-nums">{{ j + 1 }}</span>
                  <span class="flex-1 flex items-baseline gap-1.5 min-w-0">
                    <a
                      [routerLink]="['/songs', song.song_ref_uuid]"
                      class="text-paper hover:text-accent transition-colors"
                    >{{ song.name }}</a>
                    @if (song.segued) {
                      <span class="text-accent font-semibold text-base leading-none shrink-0">&gt;</span>
                    }
                  </span>
                  <span class="text-muted text-xs tabular-nums shrink-0">{{ song.times_played }}×</span>
                </li>
              }
            </ol>
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
        return this.http.get<ShowDetail>(`${DATA_BASE}/shows/${uuid}.json`)
      })
    ).subscribe({
      next: data => { this.show.set(data); this.isLoading.set(false) },
      error: () => { this.show.set(null); this.isLoading.set(false) },
    })
  }
}
