require 'spec_helper'

describe CommentsController do

  describe 'index' do
    let(:feed) { [ Factory(:comment) ] }

    before  { Comment.should_receive(:feed).with("yid", "since").and_return(feed) }
    before  { get :index, :youtube_id => "yid", :since => "since" }
    specify { assigns(:feed).should == feed }
  end

  describe 'create' do
    before  { post :create, :comment => { :author => 'mike', :body => 'body', :youtube_id => 'yid' } }
    specify { assigns(:comment).should_not be_new_record }
  end
end
