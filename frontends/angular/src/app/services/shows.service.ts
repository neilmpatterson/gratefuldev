import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import type { ShowSummary } from '../lib/data'
import { DATA_BASE } from '../../environment'

@Injectable({ providedIn: 'root' })
export class ShowsService {
  private http = inject(HttpClient)

  readonly shows = signal<ShowSummary[]>([])
  readonly isLoading = signal(false)

  load(): void {
    if (this.shows().length > 0) return
    this.isLoading.set(true)
    this.http.get<ShowSummary[]>(`${DATA_BASE}/shows/index.json`).subscribe({
      next: data => this.shows.set(data),
      complete: () => this.isLoading.set(false),
    })
  }
}
