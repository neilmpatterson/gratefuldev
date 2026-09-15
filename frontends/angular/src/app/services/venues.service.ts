import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import type { Venue } from '../lib/data'
import { DATA_BASE } from '../../environment'

@Injectable({ providedIn: 'root' })
export class VenuesService {
  private http = inject(HttpClient)

  readonly venues = signal<Venue[]>([])
  readonly isLoading = signal(false)

  load(): void {
    if (this.venues().length > 0) return
    this.isLoading.set(true)
    this.http.get<Venue[]>(`${DATA_BASE}/venues.json`).subscribe({
      next: data => this.venues.set(data),
      complete: () => this.isLoading.set(false),
    })
  }
}
