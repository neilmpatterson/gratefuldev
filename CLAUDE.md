# CLAUDE.md — GratefulDev

## Project summary

Portfolio project: 30 years of Grateful Dead live show data, same UI built in React, Vue, and Angular. Rails 8 is a local build tool only — it seeds a SQLite database from vendored YAML files and exports everything as static JSON. Frontends are static sites that read from `data/` and deploy to GitHub Pages.

## Architecture

- **Ruby version:** 3.3.3 (via rvm)
- **Rails 8** — API-only app in `api/`, local use only, never deployed
- **SQLite** — local DB, seeded from `api/db/data/*.yaml`
- **Static JSON** — exported to `data/` via `rake data:export`
- **Frontends** — `frontends/react/`, `frontends/vue/`, `frontends/angular/`, `frontends/rails/`

## Build tool commands

```bash
cd api
rails db:schema:load db:seed    # seed from YAML
rake data:export                # write static JSON to ../data/
rails server -p 3003            # optional: serve live API for dev/testing
```

## API endpoints (live server)

All return JSON. Filterable by query params where noted.

| Endpoint | Params |
|---|---|
| `GET /api/v1/shows` | `year`, `state`, `city`, `venue` |
| `GET /api/v1/shows/:uuid` | — |
| `GET /api/v1/songs` | `q` (name search) |
| `GET /api/v1/songs/:uuid` | — |
| `GET /api/v1/venues` | — |
| `GET /api/v1/cities` | — |

## Data shape

**shows/index.json** — array of `{ uuid, date, year, month, day, venue, city, state, country }`

**shows/{uuid}.json** — show + `sets: [{ uuid, position, encore, songs: [{ uuid, position, segued, name, song_ref_uuid, times_played }] }]`

**songs/index.json** — array of `{ uuid, name, slug, times_played }`

**songs/{uuid}.json** — song + `shows: [{ uuid, date, venue, city, state, country }]`

**venues.json** — array of `{ venue, city, state, country, show_count }`

**cities.json** — array of `{ city, state, country, show_count }`

## Known issues / gotchas

- `json` gem pinned to `< 3.0` in `api/Gemfile` — Rails 8 activesupport still calls `JSON.generate(..., quirks_mode: true)` which was removed in json 3.0
- Models (`Show`, `ShowSet`, `Song`, `SongRef`, `SongOccurence`) are defined locally in `api/app/models/` — no dependency on the original `gdshowsdb` gem
- Encore detection: last set AND fewer than 3 songs (matches original gem logic)

## Implementation phases

### Phase 1 — Rails 8 build tool ✅
- New Rails 8 API-only app in `api/` (Ruby 3.3.3, SQLite)
- Models with correct associations and UUID primary keys
- Seed script parses vendored YAML → populates DB
- `rake data:export` writes all static JSON to `data/`
- Live API endpoints for development use

### Phase 2 — React frontend (next)
`frontends/react/` — Vite + React 18 + TypeScript + TanStack Query

### Phase 3 — Vue frontend
`frontends/vue/` — Vite + Vue 3 + TypeScript + Pinia

### Phase 4 — Angular frontend
`frontends/angular/` — Angular 17+ + TypeScript + RxJS

### Phase 5 — Rails frontend
`frontends/rails/` — full-stack Rails 8 with Hotwire (Turbo + Stimulus), Tailwind, Importmaps. Server-rendered, no separate JS build step. Reads from its own SQLite DB seeded from the shared YAML files in `api/db/data/`. Demonstrates the modern Rails answer to the JS framework question — same features, same design, no React/Vue/Angular.

Key stack choices:
- **Turbo Drive** — SPA-like navigation without JS routing
- **Turbo Frames** — inline updates (filtering, pagination) without full page reloads
- **Turbo Streams** — for any real-time or partial-update needs
- **Stimulus** — lightweight JS controllers for interactive behavior (search input, filter toggles)
- **Importmaps** — no Webpack/Vite, no npm required
- **Tailwind** — same design system as the other frontends (via `tailwindcss-rails` gem)
- **Solid Cache / Solid Queue** — Rails 8 defaults, used for fragment caching on heavy pages (song detail with 300+ shows)

Architecture notes:
- Models and seed script are copied/adapted from `api/` — same data, own DB at `frontends/rails/storage/development.sqlite3`
- No API layer needed — controllers query ActiveRecord directly and render ERB views
- Pagination via Pagy gem (lightest option)
- The comparison story: same feature spec as React/Vue/Angular, but the server does the work

## Frontend feature spec (same across all four)

- Shows list — paginated, filterable by year / state / city
- Show detail — full setlist, encore flagged, song links
- Songs list — paginated, searchable by name
- Song detail — play count + list of shows
- Venues page — show counts
- Cities page — show counts
- Design: Tailwind, identical across all three frameworks
