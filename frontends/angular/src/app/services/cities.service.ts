import { Injectable, inject, signal } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import type { City } from '../lib/data'
import { DATA_BASE } from '../../environment'

@Injectable({ providedIn: 'root' })
export class CitiesService {
  private http = inject(HttpClient)

  readonly cities = signal<City[]>([])
  readonly isLoading = signal(false)

  load(): void {
    if (this.cities().length > 0) return
    this.isLoading.set(true)
    this.http.get<City[]>(`${DATA_BASE}/cities.json`).subscribe({
      next: data => this.cities.set(data),
      complete: () => this.isLoading.set(false),
    })
  }
}
