import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchVenues, type Venue } from '@/lib/data'

export const useVenuesStore = defineStore('venues', () => {
  const venues = ref<Venue[]>([])
  const isLoading = ref(false)

  async function load() {
    if (venues.value.length > 0) return
    isLoading.value = true
    try {
      venues.value = await fetchVenues()
    } finally {
      isLoading.value = false
    }
  }

  return { venues, isLoading, load }
})
