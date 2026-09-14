import { Component, OnInit, inject } from '@angular/core'
import { RouterLink } from '@angular/router'
import { CitiesService } from '../../services/cities.service'

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div>
      <div class="flex items-baseline justify-between mb-6">
        <h1 class="font-serif text-3xl font-bold text-paper">Cities</h1>
        <span class="text-sm text-muted tabular-nums">{{ citiesService.cities().length.toLocaleString() }}</span>
      </div>

      @if (citiesService.isLoading()) {
        <p class="text-muted">Loading…</p>
      } @else {
        <div class="divide-y divide-edge">
          @for (city of citiesService.cities(); track city.city + city.state) {
            <div class="flex items-center gap-4 py-3 text-sm">
              <a
                [routerLink]="['/shows']"
                [queryParams]="{ city: city.city, state: city.state ?? '' }"
                class="flex-1 text-paper hover:text-accent transition-colors"
              >
                {{ city.city }}{{ city.state ? ', ' + city.state : '' }}
              </a>
              <span class="text-muted text-xs shrink-0">{{ city.country }}</span>
              <span class="text-muted tabular-nums shrink-0 w-12 text-right">{{ city.show_count }}</span>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class CitiesComponent implements OnInit {
  protected citiesService = inject(CitiesService)

  ngOnInit(): void {
    this.citiesService.load()
  }
}
