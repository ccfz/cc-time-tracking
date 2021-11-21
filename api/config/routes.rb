Rails.application.routes.draw do
  resources :tasks, except: [:destroy] do
    resources :sessions, only: [:create, :index]
  end

  resources :sessions, only: [:show, :destroy]
end
