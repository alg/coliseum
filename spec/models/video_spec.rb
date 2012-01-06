require 'spec_helper'

describe Video do

  it { should have_fields :youtube_id, :title, :descr, :seconds, :image_url }

end
