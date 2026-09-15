const DATA_BASE = `${import.meta.env.BASE_URL}data`

export async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${DATA_BASE}/${path}`)
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`)
  return res.json() as Promise<T>
}

export interface ShowSummary {
  uuid: string
  date: string
  year: number
  month: number
  day: number
  venue: string
  city: string
  state: string
  country: string
}

export interface Song {
  uuid: string
  position: number
  segued: boolean
  name: string
  song_ref_uuid: string
  times_played: number
}

export interface ShowSet {
  uuid: string
  position: number
  encore: boolean
  songs: Song[]
}

export interface ShowDetail extends ShowSummary {
  sets: ShowSet[]
}

export interface SongSummary {
  uuid: string
  name: string
  slug: string
  times_played: number
}

export interface SongDetail extends SongSummary {
  shows: ShowSummary[]
}

export interface Venue {
  venue: string
  city: string
  state: string
  country: string
  show_count: number
}

export interface City {
  city: string
  state: string
  country: string
  show_count: number
}

export const fetchShows = () => fetchJson<ShowSummary[]>('shows/index.json')
export const fetchShow = (uuid: string) => fetchJson<ShowDetail>(`shows/${uuid}.json`)
export const fetchSongs = () => fetchJson<SongSummary[]>('songs/index.json')
export const fetchSong = (uuid: string) => fetchJson<SongDetail>(`songs/${uuid}.json`)
export const fetchVenues = () => fetchJson<Venue[]>('venues.json')
export const fetchCities = () => fetchJson<City[]>('cities.json')
