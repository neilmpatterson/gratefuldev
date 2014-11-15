@Gdev.module "SongsApp.List", (List, App, Backbone, Marionette, $, _) ->

	class List.Layout extends App.Views.LayoutView
		template: "songs/list/templates/list_layout"

		regions:
			panelRegion: "#panel-region"
			songsRegion: "#songs-region"

	class List.Panel extends App.Views.ItemView
		tagName: "p"
		className: "bg-info"
		template: "songs/list/templates/_panel"
		collectionEvents:
			"reset" : "render"

	class List.Song extends App.Views.ItemView
		tagName: "div"
		className: "panel panel-default",
		template: "songs/list/templates/_song"

	class List.Empty extends App.Views.ItemView
		tagName: "p"
		className: "bg-warning",
		template: "songs/list/templates/_empty"

	class List.Songs extends App.Views.CompositeView
		template: "songs/list/templates/_songs"
		childView: List.Song
		emptyView: List.Empty
		childViewContainer: "#song_list"
