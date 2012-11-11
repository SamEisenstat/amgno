class VotesController < ApplicationController
  include Base64Helper

  def upvote
    vote(:upvotes)
  end

  def downvote
    vote(:downvotes)
  end

  private
  def vote(type)
    votes = Log.vote_by_url base64_url_decode(params[:url]), type, request.remote_ip
    if votes
      head :accepted, type => votes
    else
      head :forbidden
    end
  end
end
