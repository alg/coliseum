source 'https://rubygems.org'

gem 'rails', '3.2.0.rc2'

# Fixing on mongo 1.4.0 and company with the patch that allows to access Mongo db by
# URI without mentioning the u/p (useful for local building of apps)
gem 'mongo', :git => 'git://github.com/mongodb/mongo-ruby-driver.git', :ref => '1001e59e44a2c0f1d086deac8f1f8891bfbdd354'
gem 'bson_ext'
gem 'mongoid'
gem 'mongoid_taggable'
gem 'inherited_resources'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails',   '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.0'
  gem 'uglifier',     '>= 1.0.3'
end

gem 'jquery-rails'
gem 'haml-rails'
gem 'rdiscount'

gem 'capistrano'

gem 'twitter-bootstrap-rails', :git => 'http://github.com/seyhunak/twitter-bootstrap-rails.git'

group :test do
  # Pretty printed test output
  gem 'turn', '~> 0.8.3', :require => false
  gem 'rspec'
  gem 'rspec-rails'
  gem 'mongoid-rspec'
  gem 'faker'
  gem 'timecop'
  gem 'factory_girl_rails'
  gem 'shoulda'
  gem 'guard'
  gem 'guard-rspec'
end
