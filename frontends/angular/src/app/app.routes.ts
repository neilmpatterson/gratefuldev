import type { Routes } from '@angular/router'

export const routes: Routes = [
  { path: '', redirectTo: '/shows', pathMatch: 'full' },
  {
    path: 'shows',
    loadComponent: () =>
      import('./pages/shows/shows.component').then(m => m.ShowsComponent),
  },
  {
    path: 'shows/:uuid',
    loadComponent: () =>
      import('./pages/show-detail/show-detail.component').then(m => m.ShowDetailComponent),
  },
  {
    path: 'songs',
    loadComponent: () =>
      import('./pages/songs/songs.component').then(m => m.SongsComponent),
  },
  {
    path: 'songs/:uuid',
    loadComponent: () =>
      import('./pages/song-detail/song-detail.component').then(m => m.SongDetailComponent),
  },
  {
    path: 'venues',
    loadComponent: () =>
      import('./pages/venues/venues.component').then(m => m.VenuesComponent),
  },
  {
    path: 'cities',
    loadComponent: () =>
      import('./pages/cities/cities.component').then(m => m.CitiesComponent),
  },
  {
    path: 'today',
    loadComponent: () =>
      import('./pages/today/today.component').then(m => m.TodayComponent),
  },
]
