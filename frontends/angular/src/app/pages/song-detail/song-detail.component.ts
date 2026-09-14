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
      <div class="max-w-2xl">
        <a routerLink="/songs" class="text-sm text-muted hover:text-paper transition-colors mb-8 inline-block">
          ← All songs
        </a>

        <div class="mb-10">
          <h1 class="font-serif text-3xl font-bold text-paper">{{ song()!.name }}</h1>
          <p class="text-accent mt-2 text-sm tabular-nums">{{ song()!.times_played }} performances</p>
        </div>

        <p class="text-xs text-muted tracking-widest mb-4">Shows</p>
        <div class="divide-y divide-edge">
          @for (show of song()!.shows; track show.uuid) {
            <a
              [routerLink]="['/shows', show.uuid]"
              class="flex items-center gap-4 py-3 group text-sm"
            >
              <span class="font-mono text-muted w-24 shrink-0 tabular-nums group-hover:text-accent transition-colors">
                {{ show.date }}
              </span>
              <span class="flex-1 text-paper group-hover:text-accent transition-colors">
                {{ show.venue }}
              </span>
              <span class="text-muted text-right shrink-0">
                {{ show.city }}{{ show.state ? ', ' + show.state : '' }}
              </span>
            </a>
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
