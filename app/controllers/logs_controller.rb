class LogsController < ApplicationController
  before_filter :choose_logs, :only => [:index, :more]

  def index
    if params[:search]
      render :search
    end
  end

  def more
    if params[:search]
      render :more_results
    end
  end

  def show
    @logs = [(Log.find params[:id])]
    render 'index'  # We use the same template as for multiple logs.
  end

  def upvote
    vote(:upvotes)
  end

  def downvote
    vote(:downvotes)
  end

  private
  def choose_logs
    if params[:search]
      @logs, @any_more = Log.search params[:search], params[:start].to_i, 10
    else
      @logs = Log.get_random 10
    end
  end

  def vote(type)
    log = Log.find params[:id]
    log.increment!(type)
    head :accepted, type => log.send(type)
  end
end
