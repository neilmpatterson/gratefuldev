@Gdev.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.Show extends Entities.Model

	class Entities.ShowsCollection extends Entities.PageableCollection
		model: Entities.Show
		url: Routes.api_v1_shows_path()
		idAttribute: "uuid"

	API =
		getShowEntities: (cb) ->
			shows = new Entities.ShowsCollection
			shows.fetch
				reset: true
				success: ->
					cb shows

	App.reqres.setHandler "shows:entities", (cb) ->
		API.getShowEntities cb
