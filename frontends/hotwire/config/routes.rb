Rails.application.routes.draw do
  root "shows#index"
  resources :shows, only: %i[index show]
  resources :songs, only: %i[index show]
  resources :venues, only: %i[index]
  resources :cities, only: %i[index]
  get "today", to: "today#index"
end
