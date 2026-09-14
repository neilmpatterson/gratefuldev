import { Routes, Route, NavLink } from 'react-router-dom'
import Logo from '@/components/Logo'
import BenchmarkPanel from '@/components/BenchmarkPanel'
import ShowsPage from '@/pages/ShowsPage'
import ShowDetailPage from '@/pages/ShowDetailPage'
import SongsPage from '@/pages/SongsPage'
import SongDetailPage from '@/pages/SongDetailPage'
import VenuesPage from '@/pages/VenuesPage'
import CitiesPage from '@/pages/CitiesPage'
import TodayPage from '@/pages/TodayPage'

function Nav() {
  const link = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors px-1 py-0.5 ${
      isActive ? 'text-accent border-b border-accent' : 'text-muted hover:text-paper'
    }`

  return (
    <header className="bg-ink border-b border-edge sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 flex items-center gap-6 h-14">
        <NavLink to="/" className="flex items-center gap-2 mr-2 group">
          <Logo className="text-accent group-hover:text-accent-hi transition-colors" />
          <span className="font-serif text-lg font-bold text-paper group-hover:text-accent-hi transition-colors leading-none">
            GratefulDev
          </span>
        </NavLink>

        <nav className="flex items-center gap-5">
          <NavLink to="/shows" className={link}>Shows</NavLink>
          <NavLink to="/songs" className={link}>Songs</NavLink>
          <NavLink to="/venues" className={link}>Venues</NavLink>
          <NavLink to="/cities" className={link}>Cities</NavLink>
          <NavLink to="/today" className={link}>Today in History</NavLink>
        </nav>

        <BenchmarkPanel />
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-paper font-sans">
      <Nav />
      <main className="max-w-5xl mx-auto px-6 py-10">
        <Routes>
          <Route path="/" element={<ShowsPage />} />
          <Route path="/shows" element={<ShowsPage />} />
          <Route path="/shows/:uuid" element={<ShowDetailPage />} />
          <Route path="/songs" element={<SongsPage />} />
          <Route path="/songs/:uuid" element={<SongDetailPage />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/cities" element={<CitiesPage />} />
          <Route path="/today" element={<TodayPage />} />
        </Routes>
      </main>
    </div>
  )
}
