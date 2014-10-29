json.array!(@shows) do |show|
	json.id show.uuid
	json.year show.year
	json.month show.month
	json.day show.day
	json.venue show.venue
	json.city show.city
	json.state show.state
	json.country show.country
end
