class Log < ActiveRecord::Base
  attr_accessible :reported, :transcript, :url, :public_url

  validates :url, :uniqueness => true

  after_initialize :init

  def init
    self.reported = false if reported.nil?
    self.public_url = url if public_url.nil?
  end

  def self.get_random(n)
    Log.find :all, :order => 'random()', :limit => 10
    # This is platform-dependent. See http://www.petefreitag.com/item/466.cfm
    # for alternate versions. There's also the following line, which has worse
    # performance, but works everywhere.
    # Log.find(:all).sample(n)
  end

  def self.search(text, n)
    if text
      find :all, :conditions => ['url LIKE ?', "%#{text}%"], :limit => n
    else []
    end
  end
end
