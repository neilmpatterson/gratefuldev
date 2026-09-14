<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { fetchShow, type ShowDetail } from '@/lib/data'

const route = useRoute()
const show = ref<ShowDetail | null>(null)
const isLoading = ref(true)

watchEffect(async () => {
  const uuid = route.params.uuid as string
  if (!uuid) return
  isLoading.value = true
  try {
    show.value = await fetchShow(uuid)
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="max-w-2xl">
    <p v-if="isLoading" class="text-muted">Loading…</p>
    <p v-else-if="!show" class="text-muted">Show not found.</p>

    <template v-else>
      <RouterLink to="/shows" class="text-sm text-muted hover:text-paper transition-colors mb-8 inline-block">
        ← All shows
      </RouterLink>

      <div class="mb-10">
        <p class="font-mono text-accent text-sm mb-2">{{ show.date }}</p>
        <h1 class="font-serif text-3xl font-bold text-paper leading-tight">{{ show.venue }}</h1>
        <p class="text-muted mt-2">
          {{ show.city }}{{ show.state ? `, ${show.state}` : '' }} · {{ show.country }}
        </p>
      </div>

      <div v-for="set in show.sets" :key="set.uuid" class="mb-10">
        <p class="text-xs text-muted tracking-widest mb-4">
          {{ set.encore ? 'Encore' : `Set ${set.position + 1}` }}
        </p>
        <ol class="space-y-1.5">
          <li v-for="(song, j) in set.songs" :key="song.uuid" class="flex items-baseline gap-3">
            <span class="text-muted text-xs w-5 text-right shrink-0 tabular-nums">{{ j + 1 }}</span>
            <span class="flex-1 flex items-baseline gap-1.5 min-w-0">
              <RouterLink
                :to="`/songs/${song.song_ref_uuid}`"
                class="text-paper hover:text-accent transition-colors"
              >{{ song.name }}</RouterLink>
              <span v-if="song.segued" class="text-accent font-semibold text-base leading-none shrink-0">&gt;</span>
            </span>
            <span class="text-muted text-xs tabular-nums shrink-0">{{ song.times_played }}×</span>
          </li>
        </ol>
      </div>
    </template>
  </div>
</template>
