Omegrep::Application.routes.draw do
  root :to => 'logs#home'
  resources :logs
end
