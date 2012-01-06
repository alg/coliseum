class VideosController < ApplicationController

  respond_to :json

  def index
    respond_with @videos = VideoSearch.perform(params[:query])
  end

end
