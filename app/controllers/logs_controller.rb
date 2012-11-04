class LogsController < ApplicationController
  def index
    if params[:search]
      @logs = Log.search params[:search], 10
      render :search
    else
      @logs = Log.get_random 10
    end
  end

  def show
    @logs = [(Log.find params[:id])]
    render 'index'  # We use the same template as for multiple logs.
  end

  def more
    @logs = Log.get_random 10
    render :layout => false
  end
end
