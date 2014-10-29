class API::V1::ShowsController < ApplicationController
	def index
		@shows = Show.all
	end

	def show
		@show = Show.find(params[:id])
	end
end
