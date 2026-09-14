import { Component, OnInit, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { VenuesService } from '../../services/venues.service'

@Component({
  selector: 'app-venues',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <div class="flex items-baseline justify-between mb-6">
        <h1 class="font-serif text-3xl font-bold text-paper">Venues</h1>
        <span class="text-sm text-muted tabular-nums">{{ venuesService.venues().length.toLocaleString() }}</span>
      </div>

      @if (venuesService.isLoading()) {
        <p class="text-muted">Loading…</p>
      } @else {
        <div class="divide-y divide-edge">
          @for (venue of venuesService.venues(); track venue.venue + venue.city) {
            <div class="flex items-center gap-4 py-3 text-sm">
              <a
                [routerLink]="['/shows']"
                [queryParams]="{ venue: venue.venue, city: venue.city, state: venue.state ?? '' }"
                class="flex-1 text-paper hover:text-accent transition-colors"
              >
                {{ venue.venue }}
              </a>
              <a
                [routerLink]="['/shows']"
                [queryParams]="{ city: venue.city, state: venue.state ?? '' }"
                class="text-muted hover:text-accent transition-colors shrink-0"
              >
                {{ venue.city }}{{ venue.state ? ', ' + venue.state : '' }}
              </a>
              <span class="text-muted tabular-nums shrink-0 w-12 text-right">{{ venue.show_count }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class VenuesComponent implements OnInit {
  protected venuesService = inject(VenuesService)

  ngOnInit(): void {
    this.venuesService.load()
  }
}
