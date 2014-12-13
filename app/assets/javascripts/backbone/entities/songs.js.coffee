@Gdev.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.Song extends Entities.Model

	class Entities.SongsCollection extends Entities.PageableCollection
		model: Entities.Song
		url: Routes.api_v1_songs_path()
		idAttribute: "uuid"


	API =
		getSongEntities: (cb) ->
			songs = new Entities.SongsCollection
			songs.fetch
				reset: true
				success: ->
					cb songs

	App.reqres.setHandler "songs:entities", (cb) ->
		API.getSongEntities cb
