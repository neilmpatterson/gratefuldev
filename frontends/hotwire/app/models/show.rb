class Show < ApplicationRecord
  self.primary_key = "uuid"

  has_many :show_sets, foreign_key: :show_uuid, primary_key: :uuid
  has_many :song_occurences, foreign_key: :show_uuid, primary_key: :uuid

  scope :by_year, ->(year) { where(year: year) if year.present? }
  scope :by_state, ->(state) { where(state: state) if state.present? }
  scope :by_city, ->(city) { where(city: city) if city.present? }
  scope :by_venue, ->(venue) { where(venue: venue) if venue.present? }

  def date
    Date.new(year, month, day) rescue nil
  end

  def date_string
    "#{year}-#{month.to_s.rjust(2, '0')}-#{day.to_s.rjust(2, '0')}"
  end
end
