import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchShows, type ShowSummary } from '@/lib/data'

export const useShowsStore = defineStore('shows', () => {
  const shows = ref<ShowSummary[]>([])
  const isLoading = ref(false)

  async function load() {
    if (shows.value.length > 0) return
    isLoading.value = true
    try {
      shows.value = await fetchShows()
    } finally {
      isLoading.value = false
    }
  }

  return { shows, isLoading, load }
})
