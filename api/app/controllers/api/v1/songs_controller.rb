class Api::V1::SongsController < ApplicationController
  def index
    songs = SongRef.order(:name)
    songs = songs.search(params[:q])
    render json: songs.map { |sr|
      { uuid: sr.uuid, name: sr.name, slug: sr.slug, times_played: sr.song_occurences_count }
    }
  end

  def show
    sr = SongRef.includes(song_occurences: :show).find(params[:id])
    shows = sr.song_occurences
      .sort_by { |o| [o.show.year, o.show.month, o.show.day] }
      .map { |o| s = o.show; { uuid: s.uuid, date: s.date_string, venue: s.venue, city: s.city, state: s.state, country: s.country } }
    render json: { uuid: sr.uuid, name: sr.name, slug: sr.slug, times_played: sr.song_occurences_count, shows: shows }
  end
end
