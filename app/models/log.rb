class Log < ActiveRecord::Base
  attr_accessible :reported, :transcript, :url, :public_url,
    :upvotes, :downvotes

  validates :url, :uniqueness => true

  after_initialize :init

  def init
    self.reported = false if reported.nil?
    self.public_url = url if public_url.nil?
    self.upvotes = 0      if upvotes.nil?
    self.downvotes = 0    if downvotes.nil?
  end

  def self.get_random(n)
    Log.find :all, :order => 'random()', :limit => 10
    # This is platform-dependent. See http://www.petefreitag.com/item/466.cfm
    # for alternate versions. There's also the following line, which has worse
    # performance, but works everywhere.
    # Log.find(:all).sample(n)
  end

  def self.search(phrase, n)
    if phrase
      find :all, :conditions => ['transcript LIKE ?', "%#{phrase}%"], :limit => n
    else []
    end
  end
end
