class Video

  include Mongoid::Document
  include Mongoid::Timestamps

  field :youtube_id
  field :title
  field :descr
  field :seconds, :type => Integer
  field :image_url

end
