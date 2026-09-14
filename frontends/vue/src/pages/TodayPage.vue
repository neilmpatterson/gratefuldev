<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useShowsStore } from '@/stores/shows'

const store = useShowsStore()
onMounted(() => store.load())

const now = new Date()
const month = now.getMonth() + 1
const day = now.getDate()
const dateLabel = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })

const todayShows = computed(() =>
  store.shows
    .filter(s => s.month === month && s.day === day)
    .sort((a, b) => a.year - b.year)
)

// Stable random index — seed picked once at component setup
const seed = Math.random()
const featuredIndex = computed(() =>
  todayShows.value.length > 0 ? Math.floor(seed * todayShows.value.length) : 0
)
const featured = computed(() => todayShows.value[featuredIndex.value] ?? null)
const others = computed(() => todayShows.value.filter((_, i) => i !== featuredIndex.value))
</script>

<template>
  <div class="max-w-2xl">
    <p class="text-sm text-muted mb-1 tracking-wide">Today in Dead History</p>
    <h1 class="font-serif text-4xl font-bold text-paper mb-10">{{ dateLabel }}</h1>

    <p v-if="store.isLoading" class="text-muted">Loading…</p>

    <template v-else-if="todayShows.length === 0">
      <p class="text-muted">No shows on this date in the archive.</p>
    </template>

    <template v-else>
      <!-- Featured show -->
      <div v-if="featured" class="mb-10 border-l-2 border-accent pl-5 py-1">
        <p class="font-mono text-accent text-sm mb-2">{{ featured.date }}</p>
        <RouterLink
          :to="`/shows/${featured.uuid}`"
          class="font-serif text-2xl font-semibold text-paper hover:text-accent-hi transition-colors leading-tight"
        >{{ featured.venue }}</RouterLink>
        <p class="text-muted mt-2 text-sm">
          {{ featured.city }}{{ featured.state ? `, ${featured.state}` : '' }} · {{ featured.country }}
        </p>
        <RouterLink
          :to="`/shows/${featured.uuid}`"
          class="inline-block mt-4 text-sm text-accent hover:text-accent-hi transition-colors"
        >View full setlist →</RouterLink>
      </div>

      <!-- Other shows on this date -->
      <template v-if="others.length > 0">
        <p class="text-sm text-muted mb-4">
          {{ todayShows.length === 2 ? '1 other show' : `${others.length} other shows` }} on {{ dateLabel }}
        </p>
        <div class="divide-y divide-edge">
          <div v-for="show in others" :key="show.uuid" class="flex items-baseline gap-4 py-3">
            <span class="font-mono text-muted text-sm w-20 shrink-0">{{ show.date }}</span>
            <div>
              <RouterLink
                :to="`/shows/${show.uuid}`"
                class="text-paper hover:text-accent transition-colors"
              >{{ show.venue }}</RouterLink>
              <span class="text-muted text-sm ml-3">
                {{ show.city }}{{ show.state ? `, ${show.state}` : '' }}
              </span>
            </div>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
