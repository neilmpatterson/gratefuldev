import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchCities, type City } from '@/lib/data'

export const useCitiesStore = defineStore('cities', () => {
  const cities = ref<City[]>([])
  const isLoading = ref(false)

  async function load() {
    if (cities.value.length > 0) return
    isLoading.value = true
    try {
      cities.value = await fetchCities()
    } finally {
      isLoading.value = false
    }
  }

  return { cities, isLoading, load }
})
