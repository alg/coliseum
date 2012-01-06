class VideoSearch

  LIMIT = 10

  def self.perform(q, options = {})
    criteria = Video.order_by([[:_id, :desc]]).limit(options[:limit] || LIMIT)

    unless q.blank?
      q = Regexp.escape(q)
      criteria = criteria.any_of({ :title => /#{q}/ }, { :descr => /#{q}/ })
    end

    criteria.to_a
  end

end
