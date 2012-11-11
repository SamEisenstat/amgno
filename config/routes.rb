Omegrep::Application.routes.draw do
  root :to => "logs#index"
  resources :logs do
    collection do
      get "more"
      get "more_top"
    end
  end
  match "top" => "logs#top", :as => :top_logs
  match "votes/:url/upvote" => "votes#upvote", :via => :post
  match "votes/:url/downvote" => "votes#downvote", :via => :post
  resources :reports do
    collection do
      post ":url", :action => :create
    end
  end
end
