class LogsController < ApplicationController
  def index
    if params[:search]
      #TODO AJAX
      @logs = Log.search params[:search], 10
      render :search
    else
      @logs = Log.get_random 10
    end
  end
end
