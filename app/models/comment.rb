class Comment

  include Mongoid::Document
  include Mongoid::Timestamps

  field :youtube_id
  field :author
  field :body

  index :youtube_id

  validates_presence_of :youtube_id
  validates_presence_of :body

  def as_json(params)
    { :body => self.body, :id => self.id }
  end

  def self.feed(youtube_id, since_id)
    return [] if youtube_id.blank?

    criteria = Comment.where(:youtube_id => youtube_id)

    unless since_id.blank?
      criteria = criteria.where(:_id.gt => since_id)
    end

    criteria.order_by([[ :_id, :asc ]]).to_a
  end

end
