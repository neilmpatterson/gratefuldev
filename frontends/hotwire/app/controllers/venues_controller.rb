class VenuesController < ApplicationController
  def index
    venues = Show.select("venue, city, state, country, COUNT(*) as show_count")
                 .group(:venue, :city, :state, :country)
                 .order(Arel.sql("COUNT(*) DESC"))

    if params[:q].present?
      term = "%#{params[:q]}%"
      venues = venues.where("venue LIKE ? OR city LIKE ? OR state LIKE ?", term, term, term)
    end

    @total = venues.length
    @pagy, @venues = pagy(venues, limit: params[:per] || 15)

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end
end
