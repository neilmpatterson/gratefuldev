class SongsController < ApplicationController
  def index
    songs = SongRef.order(:name)
    songs = songs.search(params[:q]) if params[:q].present?
    @pagy, @songs = pagy(songs, limit: params[:per] || 15)
    @total = songs.count

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def show
    @song = SongRef.find(params[:id])
    @shows = Show.joins(:song_occurences)
                 .where(song_occurences: { song_ref_uuid: @song.uuid })
                 .order(year: :asc, month: :asc, day: :asc)
  end
end
