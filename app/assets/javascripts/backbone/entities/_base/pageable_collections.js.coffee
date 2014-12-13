@Gdev.module "Entities", (Entities, App, Backbone, Marionette, $, _) ->

	class Entities.PageableCollection extends Backbone.PageableCollection
		mode: 'client'
		state:
			firstPage: 1,
			currentPage: 1,
			pageSize: 10
		queryParams:
			totalPages: null,
			totalRecords: null,
			currentPage: "current_page",
			pageSize: "page_size"
