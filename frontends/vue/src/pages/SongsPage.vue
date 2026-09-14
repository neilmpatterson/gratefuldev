<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useSongsStore } from '@/stores/songs'
import Pagination from '@/components/Pagination.vue'

const store = useSongsStore()
onMounted(() => store.load())

const q = ref('')
const page = ref(1)
const pageSize = ref(15)

const filtered = computed(() => {
  if (!q.value) return store.songs
  const term = q.value.toLowerCase()
  return store.songs.filter(s => s.name.toLowerCase().includes(term))
})

const pageCount = computed(() => Math.ceil(filtered.value.length / pageSize.value))
const paged = computed(() =>
  filtered.value.slice((page.value - 1) * pageSize.value, page.value * pageSize.value)
)

function handleSearch(v: string) { q.value = v; page.value = 1 }
</script>

<template>
  <div>
    <div class="flex items-baseline justify-between mb-6">
      <h1 class="font-serif text-3xl font-bold text-paper">Songs</h1>
      <span class="text-sm text-muted tabular-nums">{{ filtered.length.toLocaleString() }}</span>
    </div>

    <input
      type="search"
      placeholder="Search songs…"
      :value="q"
      @input="handleSearch(($event.target as HTMLInputElement).value)"
      class="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
    />

    <div class="divide-y divide-edge">
      <RouterLink
        v-for="song in paged"
        :key="song.uuid"
        :to="`/songs/${song.uuid}`"
        class="flex items-center justify-between py-3 text-paper hover:text-accent transition-colors group"
      >
        <span>{{ song.name }}</span>
        <span class="text-sm text-muted group-hover:text-accent transition-colors tabular-nums">
          {{ song.times_played }}×
        </span>
      </RouterLink>
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
