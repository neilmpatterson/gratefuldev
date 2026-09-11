require "yaml"

DATA_DIR = Rails.root.join("db/data")
YEARS = (1965..1995).to_a

def load_yaml(filename)
  YAML.safe_load(File.read(DATA_DIR.join(filename)), permitted_classes: [Symbol], symbolize_names: false)
end

puts "Seeding song_refs..."

song_refs_raw = load_yaml("song_refs.yaml")
song_ref_records = song_refs_raw.map do |entry|
  name, uuid = entry.first
  { uuid: uuid, name: name, slug: name.downcase.gsub(/[^a-z0-9]+/, "-").gsub(/^-|-$/, ""), song_occurences_count: 0 }
end

SongRef.insert_all!(song_ref_records)
puts "  #{SongRef.count} song_refs inserted"

puts "Seeding shows, sets, songs, and occurrences..."

song_ref_by_name = SongRef.pluck(:name, :uuid).to_h

all_shows = []
all_show_sets = []
all_songs = []
all_song_occurences = []
song_ref_counts = Hash.new(0)

YEARS.each do |year|
  data = load_yaml("#{year}.yaml")
  next unless data

  data.each_with_index do |(date_str, show_data), position|
    parts = date_str.split("/")
    y, m, d = parts[0].to_i, parts[1].to_i, parts[2].to_i
    show_uuid = show_data[:uuid]

    all_shows << {
      uuid: show_uuid,
      year: y, month: m, day: d,
      position: position,
      venue: show_data[:venue],
      city:  show_data[:city],
      state: show_data[:state],
      country: show_data[:country]
    }

    sets = show_data[:sets] || []
    sets.each_with_index do |set_data, set_pos|
      set_songs = set_data[:songs] || []
      song_count = set_songs.size
      last_set = set_pos == (sets.size - 1)
      encore = last_set && song_count < 3

      all_show_sets << {
        uuid: set_data[:uuid],
        show_uuid: show_uuid,
        position: set_pos,
        encore: encore
      }

      set_songs.each_with_index do |song_data, song_pos|
        song_name = song_data[:name]
        song_ref_uuid = song_ref_by_name[song_name]
        next unless song_ref_uuid

        all_songs << {
          uuid: song_data[:uuid],
          show_set_uuid: set_data[:uuid],
          song_ref_uuid: song_ref_uuid,
          position: song_pos,
          segued: song_data[:segued] || false
        }

        all_song_occurences << {
          uuid: "occ-#{song_data[:uuid]}",
          show_uuid: show_uuid,
          song_ref_uuid: song_ref_uuid,
          position: song_pos
        }

        song_ref_counts[song_ref_uuid] += 1
      end
    end
  end

  print "  #{year}... "
end

puts ""
puts "Inserting #{all_shows.size} shows..."
Show.insert_all!(all_shows)

puts "Inserting #{all_show_sets.size} show_sets..."
ShowSet.insert_all!(all_show_sets)

puts "Inserting #{all_songs.size} songs..."
Song.insert_all!(all_songs)

puts "Inserting #{all_song_occurences.size} song_occurences..."
SongOccurence.insert_all!(all_song_occurences)

puts "Updating song_occurences_count..."
song_ref_counts.each do |uuid, count|
  SongRef.where(uuid: uuid).update_all(song_occurences_count: count)
end

puts "Done. #{Show.count} shows, #{SongRef.count} songs, #{SongOccurence.count} occurrences."
