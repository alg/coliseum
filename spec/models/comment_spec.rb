require 'spec_helper'

describe Comment do

  it { should have_fields :youtube_id, :author, :body }

  it { should validate_presence_of :youtube_id }
  it { should validate_presence_of :body }

  describe 'feed' do
    let!(:v1c1) { Factory(:comment, :youtube_id => 'v1', :body => 'b1') }
    let!(:v2c2) { Factory(:comment, :youtube_id => 'v2', :body => 'b2') }
    let!(:v1c3) { Factory(:comment, :youtube_id => 'v1', :body => 'b3') }

    specify { Comment.feed(nil, nil).should == [] }
    specify { Comment.feed('v1', nil).should == [ v1c1, v1c3 ] }
    specify { Comment.feed('v1', v1c1.id).should == [ v1c3 ] }
  end

end
