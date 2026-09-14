<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useShowsStore } from '@/stores/shows'
import { applySearch } from '@/lib/parseSearch'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const store = useShowsStore()
onMounted(() => store.load())

const q = ref(String(route.query.q ?? ''))
const year = ref(String(route.query.year ?? ''))
const state = ref(String(route.query.state ?? ''))
const city = ref(String(route.query.city ?? ''))
const venue = ref(String(route.query.venue ?? ''))
const page = ref(1)
const pageSize = ref(15)

watch(() => route.query, (query) => {
  q.value = String(query.q ?? '')
  year.value = String(query.year ?? '')
  state.value = String(query.state ?? '')
  city.value = String(query.city ?? '')
  venue.value = String(query.venue ?? '')
  page.value = 1
})

const years = computed(() => [...new Set(store.shows.map(s => s.year))].sort())

const states = computed(() => {
  const src = year.value ? store.shows.filter(s => s.year === Number(year.value)) : store.shows
  return [...new Set(src.map(s => s.state).filter(Boolean))].sort()
})

const cities = computed(() => {
  const src = store.shows.filter(s =>
    (!year.value || s.year === Number(year.value)) && (!state.value || s.state === state.value)
  )
  return [...new Set(src.map(s => s.city).filter(Boolean))].sort()
})

const venues = computed(() => {
  const src = store.shows.filter(s =>
    (!year.value || s.year === Number(year.value)) &&
    (!state.value || s.state === state.value) &&
    (!city.value || s.city === city.value)
  )
  return [...new Set(src.map(s => s.venue).filter(Boolean))].sort()
})

const filtered = computed(() => {
  const byDropdowns = store.shows.filter(s =>
    (!year.value || s.year === Number(year.value)) &&
    (!state.value || s.state === state.value) &&
    (!city.value || s.city === city.value) &&
    (!venue.value || s.venue === venue.value)
  )
  return applySearch(byDropdowns, q.value)
})

const pageCount = computed(() => Math.ceil(filtered.value.length / pageSize.value))
const paged = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)
const hasFilters = computed(() => q.value || year.value || state.value || city.value || venue.value)

function reset() {
  q.value = ''; year.value = ''; state.value = ''; city.value = ''; venue.value = ''; page.value = 1
}
function handleYear(v: string) { year.value = v; state.value = ''; city.value = ''; venue.value = ''; page.value = 1 }
function handleState(v: string) { state.value = v; city.value = ''; venue.value = ''; page.value = 1 }
function handleCity(v: string) { city.value = v; venue.value = ''; page.value = 1 }
function handleVenue(v: string) { venue.value = v; page.value = 1 }
function handleSearch(v: string) { q.value = v; page.value = 1 }

const selectClass = 'bg-surface border border-edge rounded px-3 py-1.5 text-sm text-paper focus:outline-none focus:border-accent'
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between mb-6">
      <h1 class="font-serif text-3xl font-bold text-paper">Shows</h1>
      <span class="text-sm text-muted tabular-nums">{{ filtered.length.toLocaleString() }}</span>
    </div>

    <input
      type="search"
      placeholder="Search by venue, city, year (1977), or date (7/4/1995)…"
      :value="q"
      @input="handleSearch(($event.target as HTMLInputElement).value)"
      class="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-3 focus:outline-none focus:border-accent"
    />

    <div class="flex flex-wrap gap-2 mb-8">
      <select :value="year" @change="handleYear(($event.target as HTMLSelectElement).value)" :class="selectClass">
        <option value="">All years</option>
        <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
      </select>
      <select :value="state" @change="handleState(($event.target as HTMLSelectElement).value)" :class="selectClass">
        <option value="">All states</option>
        <option v-for="s in states" :key="s" :value="s">{{ s }}</option>
      </select>
      <select :value="city" @change="handleCity(($event.target as HTMLSelectElement).value)" :class="selectClass">
        <option value="">All cities</option>
        <option v-for="c in cities" :key="c" :value="c">{{ c }}</option>
      </select>
      <select :value="venue" @change="handleVenue(($event.target as HTMLSelectElement).value)" :class="selectClass">
        <option value="">All venues</option>
        <option v-for="v in venues" :key="v" :value="v">{{ v }}</option>
      </select>
      <button v-if="hasFilters" @click="reset" class="text-sm text-muted hover:text-paper transition-colors px-2">
        Clear filters
      </button>
    </div>

    <div class="divide-y divide-edge">
      <div v-for="show in paged" :key="show.uuid" class="flex items-center gap-4 py-3 text-sm">
        <span class="font-mono text-muted w-24 shrink-0 tabular-nums">{{ show.date }}</span>
        <RouterLink
          :to="`/shows/${show.uuid}`"
          class="flex-1 text-paper hover:text-accent transition-colors"
        >{{ show.venue }}</RouterLink>
        <RouterLink
          :to="`/shows?city=${encodeURIComponent(show.city)}&state=${encodeURIComponent(show.state ?? '')}`"
          class="text-muted hover:text-accent transition-colors shrink-0 text-right"
        >{{ show.city }}{{ show.state ? `, ${show.state}` : '' }}</RouterLink>
      </div>
      <p v-if="paged.length === 0" class="text-muted py-10 text-center">No shows match.</p>
    </div>

    <Pagination
      :page="page"
      :page-count="pageCount"
      :page-size="pageSize"
      @page="page = $event"
      @page-size="n => { pageSize = n; page = 1 }"
    />
  </div>
</template>
