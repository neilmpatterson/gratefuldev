@Gdev.module "SongsApp", (SongsApp, App, Backbone, Marionette, $, _) ->

	class SongsAppRouter extends Marionette.AppRouter
		appRoutes:
			'songs': "listSongs"

	API =
		listSongs: ->
			SongsApp.List.Controller.listSongs()

	App.addInitializer ->
		new SongsAppRouter
			controller: API