require 'spec_helper'

describe VideoSearch do

  let!(:videos) { 15.times.map { |n| Factory(:video, :title => '*' * n, :descr => '$' * n) } }

  context 'no search' do
    specify { VideoSearch.perform('').should == videos.last(10).reverse }
  end

  context 'search' do
    specify { VideoSearch.perform("****").should == videos.last(10).reverse }
    specify { VideoSearch.perform("$$$$$$$$$$$$$").should == videos.last(2).reverse }
    specify { VideoSearch.perform("no match").should == [] }
  end

end
