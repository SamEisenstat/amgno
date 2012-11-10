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

  def self.search(phrase, start, count)
    if phrase
      end_ = [start + count, 1000].min
      puts start, end_
      # Get one extra element to see if there are any more.
      result = (find :all, :conditions => ['transcript LIKE ?', "%#{phrase}%"],
         :limit => end_ + 1)[start...end_ + 1]
      # The first element is the chat logs, the second tell you if there are
      # more.
      [result[0..-2], end_ < 1000 && result.length == count]
      # Something like this would only match complete words, but it requires
      # an SQLite plugin.
      #(find :all, :conditions => ['transcript REGEXP ?', "\\w#{phrase}\\w"],
      #  :limit => end_)[start...end_]
    else []
    end
  end
end
