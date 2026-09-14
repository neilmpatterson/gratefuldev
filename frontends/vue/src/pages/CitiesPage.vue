<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useCitiesStore } from '@/stores/cities'
import Pagination from '@/components/Pagination.vue'

const route = useRoute()
const store = useCitiesStore()
onMounted(() => store.load())

const q = ref(String(route.query.q ?? ''))
const page = ref(1)
const pageSize = ref(15)

watch(() => route.query, (query) => {
  q.value = String(query.q ?? '')
  page.value = 1
})

const filtered = computed(() => {
  const sorted = [...store.cities].sort((a, b) => b.show_count - a.show_count)
  if (!q.value.trim()) return sorted
  const term = q.value.toLowerCase()
  return sorted.filter(c =>
    c.city?.toLowerCase().includes(term) ||
    c.state?.toLowerCase().includes(term) ||
    c.country?.toLowerCase().includes(term)
  )
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
      <h1 class="font-serif text-3xl font-bold text-paper">Cities</h1>
      <span class="text-sm text-muted tabular-nums">{{ filtered.length.toLocaleString() }}</span>
    </div>

    <input
      type="search"
      placeholder="Search cities…"
      :value="q"
      @input="handleSearch(($event.target as HTMLInputElement).value)"
      class="w-full bg-surface border border-edge rounded px-3 py-2 text-sm text-paper placeholder:text-muted mb-6 focus:outline-none focus:border-accent"
    />

    <div class="divide-y divide-edge">
      <RouterLink
        v-for="c in paged"
        :key="`${c.city}-${c.state}`"
        :to="`/shows?city=${encodeURIComponent(c.city)}&state=${encodeURIComponent(c.state ?? '')}`"
        class="flex items-center justify-between py-3 group"
      >
        <div>
          <p class="text-paper group-hover:text-accent transition-colors">
            {{ c.city }}{{ c.state ? `, ${c.state}` : '' }}
          </p>
          <p class="text-sm text-muted">{{ c.country }}</p>
        </div>
        <span class="text-accent text-sm tabular-nums ml-4 shrink-0">{{ c.show_count }} shows</span>
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
