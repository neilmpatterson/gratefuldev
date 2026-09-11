Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api, defaults: { format: :json } do
    namespace :v1 do
      resources :shows, only: [:index, :show]
      resources :songs, only: [:index, :show]
      resources :venues, only: [:index]
      resources :cities, only: [:index]
    end
  end
end
