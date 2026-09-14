<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isProd = import.meta.env.PROD
const open = ref(false)
const panelRef = ref<HTMLDivElement | null>(null)

interface Metrics {
  loadMs: number | null
  jsKb: number | null
  cssKb: number | null
  fetchMs: number | null
}

const metrics = computed<Metrics>(() => {
  if (!open.value) return { loadMs: null, jsKb: null, cssKb: null, fetchMs: null }

  const nav = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
  const res = performance.getEntriesByType('resource') as PerformanceResourceTiming[]

  const jsKb =
    res.filter(r => r.initiatorType === 'script' && r.transferSize > 0)
      .reduce((sum, r) => sum + r.transferSize, 0) / 1024

  const cssKb =
    res.filter(r => r.initiatorType === 'link' && r.name.endsWith('.css') && r.transferSize > 0)
      .reduce((sum, r) => sum + r.transferSize, 0) / 1024

  const shows = res.find(r => r.name.includes('shows/index.json') && r.duration > 0)

  return {
    loadMs: nav ? Math.round(nav.loadEventEnd) : null,
    // bundle sizes are only meaningful in a production build
    jsKb: isProd && jsKb > 0 ? Math.round(jsKb) : null,
    cssKb: isProd && cssKb > 0 ? Math.round(cssKb) : null,
    fetchMs: shows ? Math.round(shows.duration) : null,
  }
})

const PATTERNS = [
  {
    label: 'Data caching',
    detail:
      'Pinia setup stores — load() checks shows.value.length > 0 before fetching. Simple, explicit load-once cache with no external library.',
  },
  {
    label: 'Derived state',
    detail:
      'computed() auto-tracks reactive dependencies — no dep arrays to maintain. Recomputes only when accessed values change.',
  },
  {
    label: 'URL sync',
    detail:
      'watch(() => route.query, handler) fires whenever the query string changes on any navigation, including router.push() from other pages.',
  },
  {
    label: 'Detail pages',
    detail:
      'watchEffect on ShowDetailPage and SongDetailPage — auto-tracks route.params.uuid and re-fetches when it changes.',
  },
  {
    label: 'Active nav',
    detail:
      'useRoute().path + manual startsWith() check. Vue Router exposes active state inside RouterLink slots, not to parent components.',
  },
  {
    label: 'Component API',
    detail:
      'Class fallthrough — parent class merges onto root element automatically. Logo.vue needs no props at all.',
  },
]

function onClickOutside(e: Event) {
  if (panelRef.value && !panelRef.value.contains(e.target as Node)) {
    open.value = false
  }
}

onMounted(() => document.addEventListener('mousedown', onClickOutside))
onUnmounted(() => document.removeEventListener('mousedown', onClickOutside))
</script>

<template>
  <div ref="panelRef" class="relative ml-auto shrink-0">
    <button
      @click="open = !open"
      :class="[
        'flex items-center gap-1.5 text-sm px-2 py-1 rounded transition-colors',
        open ? 'text-accent' : 'text-muted hover:text-paper',
      ]"
    >
      Vue
      <span class="text-xs opacity-60">{{ open ? '▲' : '▼' }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 top-full mt-2 w-96 bg-surface border border-edge rounded-lg shadow-2xl z-50 p-5 text-sm"
    >
      <!-- Identity -->
      <div class="mb-5">
        <p class="text-paper font-semibold text-base">Vue 3.5</p>
        <p class="text-muted text-xs mt-1">Pinia 2 · Vue Router 4 · Tailwind 4</p>
      </div>

      <!-- Metrics -->
      <div class="mb-5">
        <p class="text-xs text-muted tracking-wide mb-3">Performance</p>
        <div class="space-y-1.5">
          <div class="flex items-baseline justify-between">
            <span class="text-muted">Page load</span>
            <span class="text-paper tabular-nums">{{ metrics.loadMs != null ? `${metrics.loadMs} ms` : '—' }}</span>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-muted">JS bundle</span>
            <span class="text-paper tabular-nums">
              {{ metrics.jsKb != null ? `${metrics.jsKb} KB` : 'dev' }}
              <span v-if="metrics.jsKb != null" class="text-muted text-xs ml-1">(gzip)</span>
            </span>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-muted">CSS bundle</span>
            <span class="text-paper tabular-nums">
              {{ metrics.cssKb != null ? `${metrics.cssKb} KB` : 'dev' }}
              <span v-if="metrics.cssKb != null" class="text-muted text-xs ml-1">(gzip)</span>
            </span>
          </div>
          <div class="flex items-baseline justify-between">
            <span class="text-muted">Shows fetch</span>
            <span class="text-paper tabular-nums">
              {{ metrics.fetchMs != null ? `${metrics.fetchMs} ms` : '—' }}
              <span class="text-muted text-xs ml-1">(2,358 shows)</span>
            </span>
          </div>
        </div>
      </div>

      <!-- Patterns -->
      <div class="mb-5">
        <p class="text-xs text-muted tracking-wide mb-3">Key patterns</p>
        <div class="space-y-3">
          <div v-for="p in PATTERNS" :key="p.label">
            <p class="text-xs text-accent mb-0.5">{{ p.label }}</p>
            <p class="text-xs text-muted leading-relaxed">{{ p.detail }}</p>
          </div>
        </div>
      </div>

      <!-- Other frontends -->
      <div class="border-t border-edge pt-4">
        <p class="text-xs text-muted mb-2">Also in this project</p>
        <div class="flex flex-wrap gap-x-4 gap-y-1 text-xs">
          <a
            href="http://localhost:5173"
            class="text-accent hover:text-accent-hi transition-colors"
            target="_blank"
            rel="noreferrer"
          >React 19 →</a>
          <a
            href="http://localhost:5175"
            class="text-accent hover:text-accent-hi transition-colors"
            target="_blank"
            rel="noreferrer"
          >Angular →</a>
          <span class="text-muted">Rails + Hotwire (coming)</span>
        </div>
      </div>
    </div>
  </div>
</template>
