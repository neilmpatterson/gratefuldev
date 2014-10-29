GratefuldevBackbone::Application.routes.draw do
  get "songs/index"
  get "songs/show"
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root to: "application#index"

	namespace :api, :defaults => {:format => :json} do
		namespace :v1 do
			resources :shows, :songs, :venues, :cities
		end
	end
end
