@Gdev.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.Header extends Entities.Model

	class Entities.HeaderCollection extends Entities.Collection
		model: Entities.Header

	API =
		getHeaders: ->
			new Entities.HeaderCollection [
				{ name: "Shows", url: Routes.shows_path() }
				{ name: "Songs", url: '' }
				{ name: "Venues", url: '' }
				{ name: "Cities", url: '' }
				{ name: "About", url: '' }
				{ name: "Code", url: '' }
			]

	App.reqres.setHandler "header:entities", ->
		API.getHeaders()
