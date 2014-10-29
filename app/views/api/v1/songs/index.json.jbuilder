json.array!(@songs) do |song|
	json.id song.uuid
	json.name song.name
	json.slug song.slug
	json.times_played song.song_occurences_count
end
