Omegrep::Application.routes.draw do
  root :to => "logs#index"
  resources :logs do
    collection do
      get "more"
    end
  end
  match "votes/:url/upvote" => "votes#upvote", :via => [:get, :post]
  match "votes/:url/downvote" => "votes#downvote", :via => [:get, :post]
end
