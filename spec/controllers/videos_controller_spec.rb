require 'spec_helper'

describe VideosController do

  describe 'index' do
    before  { VideoSearch.should_receive(:perform).with('query').and_return(@res = [ stub ]) }
    before  { get :index, :query => 'query' }
    specify { assigns(:videos).should == @res }
  end

  describe 'create' do
    it "should handle duplicates"
    it "should record the video in database"
  end

end
