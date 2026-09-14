import { Component } from '@angular/core'
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router'
import { LogoComponent } from './components/logo.component'
import { BenchmarkPanelComponent } from './components/benchmark-panel.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, LogoComponent, BenchmarkPanelComponent],
  template: `
    <div class="min-h-screen bg-ink text-paper font-sans">
      <header class="bg-ink border-b border-edge sticky top-0 z-10">
        <div class="max-w-5xl mx-auto px-6 flex items-center gap-6 h-14">
          <a routerLink="/" class="flex items-center gap-2 mr-2 group">
            <app-logo class="text-accent group-hover:text-accent-hi transition-colors" />
            <span class="font-serif text-lg font-bold text-paper group-hover:text-accent-hi transition-colors leading-none">
              GratefulDev
            </span>
          </a>

          <nav class="flex items-center gap-5">
            <a routerLink="/shows" routerLinkActive #shows="routerLinkActive"
               [class]="shows.isActive
                 ? 'text-sm font-medium px-1 py-0.5 transition-colors text-accent border-b border-accent'
                 : 'text-sm font-medium px-1 py-0.5 transition-colors text-muted hover:text-paper'">
              Shows
            </a>
            <a routerLink="/songs" routerLinkActive #songs="routerLinkActive"
               [class]="songs.isActive
                 ? 'text-sm font-medium px-1 py-0.5 transition-colors text-accent border-b border-accent'
                 : 'text-sm font-medium px-1 py-0.5 transition-colors text-muted hover:text-paper'">
              Songs
            </a>
            <a routerLink="/venues" routerLinkActive #venues="routerLinkActive"
               [class]="venues.isActive
                 ? 'text-sm font-medium px-1 py-0.5 transition-colors text-accent border-b border-accent'
                 : 'text-sm font-medium px-1 py-0.5 transition-colors text-muted hover:text-paper'">
              Venues
            </a>
            <a routerLink="/cities" routerLinkActive #cities="routerLinkActive"
               [class]="cities.isActive
                 ? 'text-sm font-medium px-1 py-0.5 transition-colors text-accent border-b border-accent'
                 : 'text-sm font-medium px-1 py-0.5 transition-colors text-muted hover:text-paper'">
              Cities
            </a>
            <a routerLink="/today" routerLinkActive #today="routerLinkActive"
               [class]="today.isActive
                 ? 'text-sm font-medium px-1 py-0.5 transition-colors text-accent border-b border-accent'
                 : 'text-sm font-medium px-1 py-0.5 transition-colors text-muted hover:text-paper'">
              Today in History
            </a>
          </nav>

          <app-benchmark-panel />
        </div>
      </header>

      <main class="max-w-5xl mx-auto px-6 py-10">
        <router-outlet />
      </main>
    </div>
  `,
})
export class AppComponent {}
