Omegrep::Application.routes.draw do
  root :to => "logs#index"
  resources :logs do
    collection do
      get "more"
    end
    member do
      put "upvote"
      put "downvote"
    end
  end
end
