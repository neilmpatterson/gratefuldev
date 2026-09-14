<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router'
import Logo from '@/components/Logo.vue'
import BenchmarkPanel from '@/components/BenchmarkPanel.vue'

const route = useRoute()

function navClass(path: string) {
  const active = route.path === path || route.path.startsWith(path + '/')
  return [
    'text-sm font-medium px-1 py-0.5 transition-colors',
    active
      ? 'text-accent border-b border-accent'
      : 'text-muted hover:text-paper',
  ]
}
</script>

<template>
  <div class="min-h-screen bg-ink text-paper font-sans">
    <header class="bg-ink border-b border-edge sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-6 flex items-center gap-6 h-14">
        <RouterLink to="/" class="flex items-center gap-2 mr-2 group">
          <Logo class="text-accent group-hover:text-accent-hi transition-colors" />
          <span class="font-serif text-lg font-bold text-paper group-hover:text-accent-hi transition-colors leading-none">
            GratefulDev
          </span>
        </RouterLink>

        <nav class="flex items-center gap-5">
          <RouterLink to="/shows" :class="navClass('/shows')">Shows</RouterLink>
          <RouterLink to="/songs" :class="navClass('/songs')">Songs</RouterLink>
          <RouterLink to="/venues" :class="navClass('/venues')">Venues</RouterLink>
          <RouterLink to="/cities" :class="navClass('/cities')">Cities</RouterLink>
          <RouterLink to="/today" :class="navClass('/today')">Today in History</RouterLink>
        </nav>

        <BenchmarkPanel />
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-10">
      <RouterView />
    </main>
  </div>
</template>
