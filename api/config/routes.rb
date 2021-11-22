Rails.application.routes.draw do
  get 'tasks_report', to: 'tasks#report'
  resources :tasks, except: [:destroy] do
    resources :sessions, only: [:create, :index]
  end

  resources :sessions, only: [:show, :destroy]
end
