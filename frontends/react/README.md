# GratefulDev — React

Vite 8 + React 19 + TypeScript + TanStack Query + React Router 7 + Tailwind 4.

Part of the [GratefulDev](../../README.md) portfolio project — the same UI implemented in React, Vue, Angular, and Rails to compare framework approaches side by side.

## Running

```bash
npm install
npm run dev        # dev server on http://localhost:5173
npm run build      # production build + copies data/ into dist/
npm run preview    # serve the production build locally
```

## Key decisions

| Concern | Approach |
|---|---|
| Data fetching | TanStack Query — `useQuery` with `staleTime: Infinity`. Cache by key, concurrent requests deduplicated, no manual load-once guard. |
| Derived state | `useMemo` with explicit dependency arrays |
| URL sync | `useSearchParams` + `useEffect([searchParams])` to re-sync filters when navigating from city/venue links |
| Active nav | `NavLink` render prop — `isActive` comes directly from React Router |
| Component API | `className` prop forwarded explicitly to root elements |

## Structure

```
src/
  App.tsx                   nav, layout, routes
  components/
    BenchmarkPanel.tsx      framework comparison panel (nav top-right)
    Logo.tsx                SVG lightning bolt
    Pagination.tsx          shared pagination with page-size selector
  lib/
    data.ts                 TypeScript interfaces + fetch functions
    parseSearch.ts          smart search: year / date / text
  pages/
    ShowsPage.tsx           list with smart search + cascading filters
    ShowDetailPage.tsx      setlist with segue arrows
    SongsPage.tsx
    SongDetailPage.tsx
    VenuesPage.tsx
    CitiesPage.tsx
    TodayPage.tsx           Today in Dead History
```

## Benchmarks

Click **React ▾** in the top-right of the nav to see live page load time, shows fetch time, bundle sizes (production build only), and a breakdown of the key React patterns used. Links to the Vue frontend at `localhost:5174`.
