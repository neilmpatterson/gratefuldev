class Api::V1::ShowsController < ApplicationController
  def index
    shows = Show.order(:year, :month, :day)
    shows = shows.by_year(params[:year])
    shows = shows.by_state(params[:state])
    shows = shows.by_city(params[:city])
    shows = shows.by_venue(params[:venue])

    render json: shows.map { |s|
      { uuid: s.uuid, date: s.date_string, year: s.year, month: s.month, day: s.day,
        venue: s.venue, city: s.city, state: s.state, country: s.country }
    }
  end

  def show
    s = Show.includes(show_sets: { songs: :song_ref }).find(params[:id])
    sets = s.show_sets.sort_by(&:position).map do |set|
      songs = set.songs.sort_by(&:position).map do |song|
        { uuid: song.uuid, position: song.position, segued: song.segued,
          name: song.song_ref.name, song_ref_uuid: song.song_ref_uuid,
          times_played: song.song_ref.song_occurences_count }
      end
      { uuid: set.uuid, position: set.position, encore: set.encore, songs: songs }
    end
    render json: { uuid: s.uuid, date: s.date_string, year: s.year, month: s.month, day: s.day,
                   venue: s.venue, city: s.city, state: s.state, country: s.country, sets: sets }
  end
end
