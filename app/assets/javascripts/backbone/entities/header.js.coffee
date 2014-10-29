@Gdev.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.Header extends Entities.Model

	class Entities.HeaderCollection extends Entities.Collection
		model: Entities.Header

	API =
		getHeaders: ->
			new Entities.HeaderCollection [
				{ name: "Shows" }
				{ name: "Songs" }
				{ name: "Venues" }
				{ name: "Cities" }
				{ name: "About" }
				{ name: "Code" }
			]

	App.reqres.setHandler "header:entities", ->
		API.getHeaders()
