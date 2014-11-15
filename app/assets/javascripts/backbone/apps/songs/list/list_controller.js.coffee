@Gdev.module "SongsApp.List", (List, App, Backbone, Marionette, $, _) ->

	List.Controller =

		listSongs: ->
			App.request "songs:entities", (songs) =>
				
				@layout = @getLayoutView()

				@layout.on "show", =>
					@showPanel songs
					@showSongs songs

				App.mainRegion.show @layout

		showPanel: (songs) ->
			panelView = @getPanelView songs
			@layout.panelRegion.show panelView

		showSongs: (songs) ->
			songsView = @getSongsView songs
			@layout.songsRegion.show songsView

		getSongsView: (songs) ->
			new List.Songs
				collection: songs

		getPanelView: (songs) ->
			new List.Panel
				collection: songs

		getLayoutView: ->
			new List.Layout
