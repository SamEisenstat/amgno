class Log < ActiveRecord::Base
  attr_accessible :reported, :transcript, :url, :public_url

  validates :url, :uniqueness => true

  after_initialize :init

  def init
    self.reported = false if reported.nil?
    self.public_url = url if public_url.nil?
  end

  def self.get_random(n)
#, :order => method(:rand), :limit => 10
    Log.find(:all).sample(n)
  end
end
