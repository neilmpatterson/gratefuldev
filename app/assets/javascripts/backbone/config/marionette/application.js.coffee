do (Backbone) ->

	_.extend Backbone.Marionette.Application::,

		navigate: (route, options = {trigger: true}) ->
			route = "#" + route if route.charAt(0) is "/"
			Backbone.history.navigate route, options

		getCurrentRoute: ->
			Backbone.history.fragment

		startHistory: ->
			if Backbone.history
				Backbone.history.start()
