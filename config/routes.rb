Omegrep::Application.routes.draw do
  root :to => 'log#home'
  match 'random' => 'log#random'
end
