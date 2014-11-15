@Gdev = do (Backbone, Marionette) ->

	App = new Backbone.Marionette.Application

	App.rootRoute = Routes.shows_path()

	App.addRegions
		headerRegion: "#header-region"
		mainRegion: "#main-region"
		footerRegion: "#footer-region"

	App.addInitializer ->
		App.module("HeaderApp").start()
		App.module("FooterApp").start()

	App.on "start", ->
		@startHistory()
		@navigate(@rootRoute, trigger: true) unless @getCurrentRoute()

	App
