class CitiesController < ApplicationController
  def index
    cities = Show.select("city, state, country, COUNT(*) as show_count")
                 .group(:city, :state, :country)
                 .order(Arel.sql("COUNT(*) DESC"))

    if params[:q].present?
      term = "%#{params[:q]}%"
      cities = cities.where("city LIKE ? OR state LIKE ? OR country LIKE ?", term, term, term)
    end

    @total = cities.length
    @pagy, @cities = pagy(cities, limit: params[:per] || 15)

    respond_to do |format|
      format.html
      format.turbo_stream
    end
  end
end
