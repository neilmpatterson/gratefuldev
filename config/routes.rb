GratefuldevBackbone::Application.routes.draw do
  resources :shows, :songs

  root to: "application#index"

	namespace :api, :defaults => {:format => :json} do
		namespace :v1 do
			resources :shows, :songs, :venues, :cities
		end
	end
end
