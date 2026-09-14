import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchSongs, type SongSummary } from '@/lib/data'

export const useSongsStore = defineStore('songs', () => {
  const songs = ref<SongSummary[]>([])
  const isLoading = ref(false)

  async function load() {
    if (songs.value.length > 0) return
    isLoading.value = true
    try {
      songs.value = await fetchSongs()
    } finally {
      isLoading.value = false
    }
  }

  return { songs, isLoading, load }
})
