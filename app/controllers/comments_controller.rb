class CommentsController < ApplicationController

  skip_before_filter :verify_authenticity_token

  respond_to :json

  def index
    youtube_id = params[:youtube_id]
    since      = params[:since]

    respond_with @feed = Comment.feed(youtube_id, since)
  end

  def create
    @comment = Comment.create(params[:comment])

    respond_with @comment
  end

end
