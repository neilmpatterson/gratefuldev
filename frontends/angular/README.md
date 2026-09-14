# GratefulDev — Angular

Vite 6 + Angular 18 + TypeScript + RxJS + Angular Router + Tailwind 4.

Part of the [GratefulDev](../../README.md) portfolio project — the same UI implemented in React, Vue, Angular, and Rails to compare framework approaches side by side.

## Running

```bash
npm install --legacy-peer-deps
npm run dev          # dev server on http://localhost:5175
npm run build        # production build + copies data/ into dist/
npm run preview      # serve the production build locally
npm run type-check   # tsc without building
```

> `--legacy-peer-deps` is needed once on install because `@analogjs/vite-plugin-angular` (which enables Vite + Angular) has peer dependency ranges that don't align perfectly with Angular 18.

## Key decisions

| Concern | Approach |
|---|---|
| Data caching | Injectable service with `signal<T[]>()` — `load()` checks `shows().length > 0` before fetching. Explicit load-once cache, no external library. |
| Derived state | `computed()` signals — auto-tracks reactive signal dependencies. Same concept as Vue's `computed()`, Angular-native. |
| URL sync | `ActivatedRoute.queryParams` Observable — subscribe in `ngOnInit`, fires on every navigation including `router.navigate()` from other pages. |
| Detail pages | `ActivatedRoute.paramMap` + `switchMap` — cancels inflight HTTP requests when UUID changes mid-navigation. RxJS pipeline, no manual cleanup needed. |
| Active nav | `RouterLinkActive` directive with template reference (`#link="routerLinkActive"`) — reads `link.isActive` to toggle classes. Angular built-in. |
| Component API | `input()` / `output()` signal functions (Angular 17+) — new signal-based API replacing `@Input()` / `@Output()` decorators. |

## Structure

```
src/
  main.ts                     bootstrapApplication, provideRouter, provideHttpClient
  styles.css                  Tailwind v4 @theme design tokens
  app/
    app.component.ts          nav + router-outlet (standalone root component)
    app.routes.ts             lazy-loaded route definitions
    lib/
      data.ts                 TypeScript interfaces (ShowSummary, ShowDetail, etc.)
      parse-search.ts         smart search: year / date / text
    services/
      shows.service.ts        signal-based load-once injectable
      songs.service.ts
      venues.service.ts
      cities.service.ts
    components/
      benchmark-panel.component.ts   framework comparison panel (nav top-right)
      logo.component.ts              SVG lightning bolt
      pagination.component.ts        shared pagination with page-size selector
    pages/
      shows/shows.component.ts           list with smart search + cascading filters
      show-detail/show-detail.component.ts   setlist with segue arrows
      songs/songs.component.ts
      song-detail/song-detail.component.ts
      venues/venues.component.ts
      cities/cities.component.ts
      today/today.component.ts           Today in Dead History
```

## Benchmarks

Click **Angular ▾** in the top-right of the nav to see live page load time, shows fetch time, bundle sizes (production build only), and a breakdown of the key Angular patterns used. Links to the React frontend at `localhost:5173` and Vue at `localhost:5174`.

## Angular specifics

- **Standalone components** — no NgModule anywhere; each component imports exactly what it uses
- **New control flow** — `@for`, `@if`, `@else` block syntax (Angular 17+), not `*ngFor` / `*ngIf`
- **Signals throughout** — `signal()`, `computed()`, `input()`, `output()` — the Angular 17+ reactivity model
- **Lazy routes** — all page components are `loadComponent`-loaded, so the initial bundle is small
- **zone.js** — Angular's change detection mechanism; unlike React/Vue which use a virtual DOM diffing model, Angular tracks DOM updates via zone.js's monkey-patching of async APIs
