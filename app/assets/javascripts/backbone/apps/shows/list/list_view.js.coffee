@Gdev.module "ShowsApp.List", (List, App, Backbone, Marionette, $, _) ->

	class List.Layout extends App.Views.LayoutView
		template: "shows/list/templates/list_layout"

		regions:
			panelRegion: "#panel-region"
			showsRegion: "#shows-region"

	class List.Panel extends App.Views.ItemView
		tagName: "p"
		className: "panel-info"
		template: "shows/list/templates/_panel"
		collectionEvents:
			"reset" : "render"
		templateHelpers: ->
			page_size: @collection.state.pageSize
			total_records: @collection.state.totalRecords
			total_pages: @collection.state.totalPages
			current_page: @collection.state.currentPage

	class List.Show extends App.Views.ItemView
		tagName: "tr"
		className: "panel panel-default",
		template: "shows/list/templates/_show"

	class List.Empty extends App.Views.ItemView
		tagName: "tr"
		className: "bg-warning",
		template: "shows/list/templates/_empty"

	class List.Shows extends App.Views.CompositeView
		template: "shows/list/templates/_shows"
		childView: List.Show
		childViewContainer: "#show_list"
		emptyView: List.Empty
		onRender: ->
			paginator = new Backgrid.Extension.Paginator({
				collection: @collection
			});
			@$el.find("#data_pagination").append(paginator.render().el);

