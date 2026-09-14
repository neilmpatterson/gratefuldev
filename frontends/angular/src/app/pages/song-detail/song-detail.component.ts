import { Component, OnInit, inject, signal } from '@angular/core'
import { ActivatedRoute, RouterLink } from '@angular/router'
import { HttpClient } from '@angular/common/http'
import { switchMap, map } from 'rxjs'
import type { SongDetail } from '../../lib/data'

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [RouterLink],
  template: `
    @if (isLoading()) {
      <p class="text-muted">Loading…</p>
    } @else if (song()) {
      <div>
        <div class="mb-8">
          <h1 class="font-serif text-3xl font-bold text-paper mb-1">{{ song()!.name }}</h1>
          <p class="text-muted text-sm">Played {{ song()!.times_played }} times</p>
        </div>

        <div class="divide-y divide-edge">
          @for (show of song()!.shows; track show.uuid) {
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
        </div>
      </div>
    } @else {
      <p class="text-muted">Song not found.</p>
    }
  `,
})
export class SongDetailComponent implements OnInit {
  private route = inject(ActivatedRoute)
  private http = inject(HttpClient)

  readonly song = signal<SongDetail | null>(null)
  readonly isLoading = signal(true)

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('uuid')!),
      switchMap(uuid => {
        this.isLoading.set(true)
        return this.http.get<SongDetail>(`/data/songs/${uuid}.json`)
      })
    ).subscribe({
      next: data => { this.song.set(data); this.isLoading.set(false) },
      error: () => { this.song.set(null); this.isLoading.set(false) },
    })
  }
}
