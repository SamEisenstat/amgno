class LogsController < ApplicationController
  def index
    if params[:search]
      @logs = Log.search params[:search], 10
      #TODO fix
      if params[:search] == "search"
        @logs = []
        render :search
      end
    else
      @logs = Log.get_random 10
    end
  end
end
