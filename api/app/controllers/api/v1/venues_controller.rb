class Api::V1::VenuesController < ApplicationController
  def index
    venues = Show.select(:venue, :city, :state, :country)
      .group(:venue, :city, :state, :country)
      .order(:venue)
      .map do |row|
        count = Show.where(venue: row.venue, city: row.city).count
        { venue: row.venue, city: row.city, state: row.state, country: row.country, show_count: count }
      end
    render json: venues
  end
end
