class Api::V1::CitiesController < ApplicationController
  def index
    cities = Show.select(:city, :state, :country)
      .group(:city, :state, :country)
      .order(:city)
      .map do |row|
        count = Show.where(city: row.city, state: row.state).count
        { city: row.city, state: row.state, country: row.country, show_count: count }
      end
    render json: cities
  end
end
