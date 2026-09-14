<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  page: number
  pageCount: number
  pageSize: number
}>()

const emit = defineEmits<{
  page: [value: number]
  pageSize: [value: number]
}>()

const PAGE_SIZES = [15, 25, 50, 100]
const hidden = computed(() => props.pageCount <= 1 && props.pageSize === PAGE_SIZES[0])
</script>

<template>
  <div v-if="!hidden" class="flex items-center justify-between mt-8 pt-4 border-t border-edge">
    <div class="flex items-center gap-2 text-sm text-muted">
      <span>Per page</span>
      <select
        :value="pageSize"
        @change="emit('pageSize', Number(($event.target as HTMLSelectElement).value))"
        class="bg-surface border border-edge rounded px-2 py-1 text-sm text-paper focus:outline-none focus:border-accent"
      >
        <option v-for="n in PAGE_SIZES" :key="n" :value="n">{{ n }}</option>
      </select>
    </div>

    <div v-if="pageCount > 1" class="flex items-center gap-3">
      <button
        :disabled="page === 1"
        @click="emit('page', page - 1)"
        class="px-3 py-1 rounded bg-surface border border-edge text-sm text-paper disabled:opacity-30 hover:border-accent hover:text-accent transition-colors"
      >←</button>
      <span class="text-sm text-muted tabular-nums">{{ page }} / {{ pageCount }}</span>
      <button
        :disabled="page === pageCount"
        @click="emit('page', page + 1)"
        class="px-3 py-1 rounded bg-surface border border-edge text-sm text-paper disabled:opacity-30 hover:border-accent hover:text-accent transition-colors"
      >→</button>
    </div>
  </div>
</template>
