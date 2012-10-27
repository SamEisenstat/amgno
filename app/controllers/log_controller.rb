class LogController < ApplicationController
  def home
  end

  def random
    @logs = Log.get_random 10
  end
end
