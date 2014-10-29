json.id @song.uuid
json.(@song, :name, :slug )
json.times_played @song.song_occurences_count
