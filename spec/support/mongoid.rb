RSpec.configure do |config|

  # Cleanup database before each spec
  config.before do
    Mongoid.master.collections.select {|c| c.name !~ /system/ }.each(&:drop)
  end

end
