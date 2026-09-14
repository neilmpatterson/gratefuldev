class ShowsController < ApplicationController
  def index
    shows = Show.order(year: :asc, month: :asc, day: :asc, position: :asc)

    if params[:q].present?
      q = params[:q].strip
      if q =~ /^\d{4}$/
        shows = shows.where(year: q.to_i)
      elsif (d = parse_date(q))
        shows = shows.where(year: d[0], month: d[1], day: d[2])
      else
        term = "%#{q}%"
        shows = shows.where("venue LIKE ? OR city LIKE ? OR state LIKE ?", term, term, term)
      end
    end

    shows = shows.by_year(params[:year]).by_state(params[:state])
                 .by_city(params[:city]).by_venue(params[:venue])

    @pagy, @shows = pagy(shows, limit: params[:per] || 15)
    @years  = Show.distinct.order(year: :asc).pluck(:year)
    @states = Show.distinct.order(:state).pluck(:state).compact
    @cities = Show.distinct.order(:city).pluck(:city).compact
    @venues = Show.distinct.order(:venue).pluck(:venue).compact
    @total  = shows.count

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end

  def show
    @show = Show.includes(show_sets: { songs: :song_ref }).find(params[:id])
  end

  private

  def parse_date(q)
    if q =~ %r{^(\d{1,2})[/\-](\d{1,2})[/\-](\d{4})$}
      [$3.to_i, $1.to_i, $2.to_i]
    elsif q =~ %r{^(\d{4})[/\-](\d{1,2})[/\-](\d{1,2})$}
      [$1.to_i, $2.to_i, $3.to_i]
    end
  end
end
