import { createRouter, createWebHistory } from 'vue-router'
import ShowsPage from '@/pages/ShowsPage.vue'
import ShowDetailPage from '@/pages/ShowDetailPage.vue'
import SongsPage from '@/pages/SongsPage.vue'
import SongDetailPage from '@/pages/SongDetailPage.vue'
import VenuesPage from '@/pages/VenuesPage.vue'
import CitiesPage from '@/pages/CitiesPage.vue'
import TodayPage from '@/pages/TodayPage.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/shows' },
    { path: '/shows', component: ShowsPage },
    { path: '/shows/:uuid', component: ShowDetailPage },
    { path: '/songs', component: SongsPage },
    { path: '/songs/:uuid', component: SongDetailPage },
    { path: '/venues', component: VenuesPage },
    { path: '/cities', component: CitiesPage },
    { path: '/today', component: TodayPage },
  ],
})
