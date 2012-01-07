class Video

  include Mongoid::Document
  include Mongoid::Timestamps

  field :youtube_id
  field :title
  field :descr
  field :seconds, :type => Integer
  field :image_url

  def as_json(params)
    super(:only => [ :youtube_id, :title, :descr, :seconds, :image_url ], :methods => [ :id ])
  end

end
