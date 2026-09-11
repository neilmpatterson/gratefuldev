require "json"
require "fileutils"

namespace :data do
  desc "Export all data to static JSON files in ../data/"
  task export: :environment do
    out = Rails.root.join("../data")
    FileUtils.mkdir_p(out.join("shows"))
    FileUtils.mkdir_p(out.join("songs"))

    puts "Exporting shows index..."
    shows = Show.order(:year, :month, :day).map do |s|
      {
        uuid: s.uuid,
        date: s.date_string,
        year: s.year,
        month: s.month,
        day: s.day,
        venue: s.venue,
        city: s.city,
        state: s.state,
        country: s.country
      }
    end
    File.write(out.join("shows/index.json"), JSON.generate(shows))
    puts "  #{shows.size} shows"

    puts "Exporting individual show files..."
    Show.includes(show_sets: { songs: :song_ref }).find_each do |show|
      sets = show.show_sets.sort_by(&:position).map do |set|
        songs = set.songs.sort_by(&:position).map do |song|
          {
            uuid: song.uuid,
            position: song.position,
            segued: song.segued,
            name: song.song_ref.name,
            song_ref_uuid: song.song_ref_uuid,
            times_played: song.song_ref.song_occurences_count
          }
        end
        {
          uuid: set.uuid,
          position: set.position,
          encore: set.encore,
          songs: songs
        }
      end

      payload = {
        uuid: show.uuid,
        date: show.date_string,
        year: show.year,
        month: show.month,
        day: show.day,
        venue: show.venue,
        city: show.city,
        state: show.state,
        country: show.country,
        sets: sets
      }
      File.write(out.join("shows/#{show.uuid}.json"), JSON.generate(payload))
    end
    puts "  #{Show.count} show files written"

    puts "Exporting songs index..."
    songs = SongRef.order(:name).map do |sr|
      {
        uuid: sr.uuid,
        name: sr.name,
        slug: sr.slug,
        times_played: sr.song_occurences_count
      }
    end
    File.write(out.join("songs/index.json"), JSON.generate(songs))
    puts "  #{songs.size} songs"

    puts "Exporting individual song files..."
    SongRef.includes(song_occurences: :show).find_each do |sr|
      shows_played = sr.song_occurences
        .sort_by { |o| [o.show.year, o.show.month, o.show.day] }
        .map do |o|
          s = o.show
          { uuid: s.uuid, date: s.date_string, venue: s.venue, city: s.city, state: s.state, country: s.country }
        end

      payload = {
        uuid: sr.uuid,
        name: sr.name,
        slug: sr.slug,
        times_played: sr.song_occurences_count,
        shows: shows_played
      }
      File.write(out.join("songs/#{sr.uuid}.json"), JSON.generate(payload))
    end
    puts "  #{SongRef.count} song files written"

    puts "Exporting venues..."
    venues = Show.select(:venue, :city, :state, :country)
      .group(:venue, :city, :state, :country)
      .order(:venue)
      .map do |row|
        count = Show.where(venue: row.venue, city: row.city).count
        { venue: row.venue, city: row.city, state: row.state, country: row.country, show_count: count }
      end
    File.write(out.join("venues.json"), JSON.generate(venues))
    puts "  #{venues.size} venues"

    puts "Exporting cities..."
    cities = Show.select(:city, :state, :country)
      .group(:city, :state, :country)
      .order(:city)
      .map do |row|
        count = Show.where(city: row.city, state: row.state).count
        { city: row.city, state: row.state, country: row.country, show_count: count }
      end
    File.write(out.join("cities.json"), JSON.generate(cities))
    puts "  #{cities.size} cities"

    puts "Export complete."
  end
end
