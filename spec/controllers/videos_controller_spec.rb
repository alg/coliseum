require 'spec_helper'

describe VideosController do

  describe 'index' do
    before  { VideoSearch.should_receive(:perform).with('query').and_return(@res = [ stub ]) }
    before  { get :index, :query => 'query' }
    specify { assigns(:videos).should == @res }
  end

  describe 'create' do
    before  { post :create, :data => { :youtube_id => "abc" } }
    specify { assigns(:video).should_not be_new_record }
  end

end
