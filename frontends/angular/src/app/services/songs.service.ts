import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import type { SongSummary } from '../lib/data'
import { DATA_BASE } from '../../environment'

@Injectable({ providedIn: 'root' })
export class SongsService {
  private http = inject(HttpClient)

  readonly songs = signal<SongSummary[]>([])
  readonly isLoading = signal(false)

  load(): void {
    if (this.songs().length > 0) return
    this.isLoading.set(true)
    this.http.get<SongSummary[]>(`${DATA_BASE}/songs/index.json`).subscribe({
      next: data => this.songs.set(data),
      complete: () => this.isLoading.set(false),
    })
  }
}
