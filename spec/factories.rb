Factory.sequence(:youtube_id) { |n| "youtube_#{n}" }

Factory.define :video do |f|
  f.title      { Faker::Lorem.words }
  f.descr      { Faker::Lorem.paragraph }
  f.youtube_id { Factory.next(:youtube_id) }
end

Factory.define :comment do |f|
  f.youtube_id "yid"
  f.body       { Faker::Lorem.words }
end
