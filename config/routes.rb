Omegrep::Application.routes.draw do
  root :to => 'logs#index'
  get '/logs/more' => 'logs#more'
  resources :logs
end
