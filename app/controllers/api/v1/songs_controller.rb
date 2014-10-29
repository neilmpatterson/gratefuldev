class API::V1::SongsController < ApplicationController
  def index
		@songs = SongRef.all
	end

	def show
		@song = SongRef.find(params[:id])
	end
end
