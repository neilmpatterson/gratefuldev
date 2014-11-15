@Gdev.module "ShowsApp.List", (List, App, Backbone, Marionette, $, _) ->

	class List.Layout extends App.Views.LayoutView
		template: "shows/list/templates/list_layout"

		regions:
			panelRegion: "#panel-region"
			showsRegion: "#shows-region"

	class List.Panel extends App.Views.ItemView
		tagName: "p"
		className: "bg-info"
		template: "shows/list/templates/_panel"
		collectionEvents:
			"reset" : "render"

	class List.Show extends App.Views.ItemView
		tagName: "div"
		className: "panel panel-default",
		template: "shows/list/templates/_show"

	class List.Empty extends App.Views.ItemView
		tagName: "p"
		className: "bg-warning",
		template: "shows/list/templates/_empty"

	class List.Shows extends App.Views.CompositeView
		template: "shows/list/templates/_shows"
		childView: List.Show
		childViewContainer: "#show_list"
		emptyView: List.Empty
