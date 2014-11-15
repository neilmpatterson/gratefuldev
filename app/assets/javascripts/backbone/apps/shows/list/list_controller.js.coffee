@Gdev.module "ShowsApp.List", (List, App, Backbone, Marionette, $, _) ->

	List.Controller =

		listShows: ->
			App.request "shows:entities", (shows) =>
				
				@layout = @getLayoutView()

				@layout.on "show", =>
					@showPanel shows
					@showShows shows

				App.mainRegion.show @layout

		showPanel: (shows) ->
			panelView = @getPanelView shows
			@layout.panelRegion.show panelView

		showShows: (shows) ->
			showsView = @getShowsView shows
			@layout.showsRegion.show showsView

		getShowsView: (shows) ->
			new List.Shows
				collection: shows

		getPanelView: (shows) ->
			new List.Panel
				collection: shows

		getLayoutView: ->
			new List.Layout
