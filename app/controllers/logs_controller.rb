class LogsController < ApplicationController
  def index
    if params[:search]
      @logs = Log.search params[:search], 10
      render :search
    else
      @logs = Log.get_random 10
    end
  end

  def more
    @logs = Log.get_random 10
    render :layout => false
  end
end
