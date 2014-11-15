@Gdev.module "ShowsApp", (ShowsApp, App, Backbone, Marionette, $, _) ->

	class ShowsAppRouter extends Marionette.AppRouter
		appRoutes:
			'shows': "listShows"

	API =
		listShows: ->
			ShowsApp.List.Controller.listShows()

	App.addInitializer ->
		new ShowsAppRouter
			controller: API