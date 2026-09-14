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
