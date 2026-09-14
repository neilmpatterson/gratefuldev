# GratefulDev — Vue

Vite 6 + Vue 3.5 + TypeScript + Pinia + Vue Router 4 + Tailwind 4.

Part of the [GratefulDev](../../README.md) portfolio project — the same UI implemented in React, Vue, Angular, and Rails to compare framework approaches side by side.

## Running

```bash
npm install
npm run dev          # dev server on http://localhost:5174
npm run build        # production build + copies data/ into dist/
npm run preview      # serve the production build locally
npm run type-check   # vue-tsc without building
```

## Key decisions

| Concern | Approach |
|---|---|
| Data fetching | Pinia setup stores — `load()` checks `data.value.length > 0` before fetching. Explicit load-once cache, no external library. |
| Derived state | `computed()` — auto-tracks reactive dependencies, no dep arrays |
| URL sync | `watch(() => route.query, handler)` fires on any navigation that changes the query string |
| Detail pages | `watchEffect` — auto-tracks `route.params.uuid`, re-fetches when it changes |
| Active nav | `useRoute().path` + manual `startsWith()` check |
| Component API | Class fallthrough — parent `class` merges onto root element automatically. `Logo.vue` needs no props. |

## Structure

```
src/
  App.vue                   nav, layout, router-view
  router/index.ts           Vue Router routes
  stores/                   Pinia stores (shows, songs, venues, cities)
  components/
    BenchmarkPanel.vue      framework comparison panel (nav top-right)
    Logo.vue                SVG lightning bolt (class fallthrough)
    Pagination.vue          shared pagination with page-size selector
  lib/
    data.ts                 TypeScript interfaces + fetch functions
    parseSearch.ts          smart search: year / date / text
  pages/
    ShowsPage.vue           list with smart search + cascading filters
    ShowDetailPage.vue      setlist with segue arrows
    SongsPage.vue
    SongDetailPage.vue
    VenuesPage.vue
    CitiesPage.vue
    TodayPage.vue           Today in Dead History
```

## Benchmarks

Click **Vue ▾** in the top-right of the nav to see live page load time, shows fetch time, bundle sizes (production build only), and a breakdown of the key Vue patterns used. Links to the React frontend at `localhost:5173`.

## Bundle size

~44 KB JS (gzip) in production — roughly half the React bundle, since Pinia + Vue Router is a lighter stack than TanStack Query + React Router.
