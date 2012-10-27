class LogsController < ApplicationController
  def home
  end

  def index
    if params[:random]
      @logs = Log.get_random 10
    elsif params[:search]
      @logs = Log.search params[:search], 10
    else
      @logs = Log.get_random 10
    end
  end
end
