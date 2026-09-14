<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { fetchSong, type SongDetail } from '@/lib/data'

const route = useRoute()
const song = ref<SongDetail | null>(null)
const isLoading = ref(true)

watchEffect(async () => {
  const uuid = route.params.uuid as string
  if (!uuid) return
  isLoading.value = true
  try {
    song.value = await fetchSong(uuid)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl">
    <p v-if="isLoading" class="text-muted">Loading…</p>
    <p v-else-if="!song" class="text-muted">Song not found.</p>

    <template v-else>
      <RouterLink to="/songs" class="text-sm text-muted hover:text-paper transition-colors mb-8 inline-block">
        ← All songs
      </RouterLink>

      <div class="mb-10">
        <h1 class="font-serif text-3xl font-bold text-paper">{{ song.name }}</h1>
        <p class="text-accent mt-2 text-sm tabular-nums">{{ song.times_played }} performances</p>
      </div>

      <p class="text-xs text-muted tracking-widest mb-4">Shows</p>
      <div class="divide-y divide-edge">
        <RouterLink
          v-for="s in song.shows"
          :key="s.uuid"
          :to="`/shows/${s.uuid}`"
          class="flex items-center gap-4 py-3 group text-sm"
        >
          <span class="font-mono text-muted w-24 shrink-0 tabular-nums group-hover:text-accent transition-colors">
            {{ s.date }}
          </span>
          <span class="flex-1 text-paper group-hover:text-accent transition-colors">{{ s.venue }}</span>
          <span class="text-muted text-right shrink-0">
            {{ s.city }}{{ s.state ? `, ${s.state}` : '' }}
          </span>
        </RouterLink>
      </div>
    </template>
  </div>
</template>
