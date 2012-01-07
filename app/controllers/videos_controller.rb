class VideosController < ApplicationController

  respond_to :json

  def index
    respond_with @videos = VideoSearch.perform(params[:query])
  end

  def create
    @video = Video.new(params[:data])
    @video.save
    respond_with @video
  end

end
