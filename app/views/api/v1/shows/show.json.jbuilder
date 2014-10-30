json.partial! 'api/v1/shows/base', show: @show
json.sets @show.show_sets do |json, set|
	json.uuid set.uuid
	json.position set.position
	json.encore set.encore
	json.songs set.songs do |json, song|
		json.uuid song.uuid
		json.position song.position
		json.segued song.segued
		json.name song.song_ref.name
		json.times_played song.song_ref.song_occurences_count
	end
end