Omegrep::Application.routes.draw do
  root :to => 'logs#index'
  resources :logs
end
