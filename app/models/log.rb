class Log < ActiveRecord::Base
  attr_accessible :reported, :transcript, :url, :public_url,
    :upvotes, :downvotes

  has_many :votes
  validates :url, :uniqueness => true

  after_initialize :init

  def init
    self.reported = false if reported.nil?
    self.public_url = url if public_url.nil?
    self.upvotes = 0      if upvotes.nil?
    self.downvotes = 0    if downvotes.nil?
  end

  # Return 10 random logs
  def self.get_random(n)
    Log.find :all, :order => 'random()', :limit => 10
    # This is platform-dependent. See http://www.petefreitag.com/item/466.cfm
    # for alternate versions. There's also the following line, which has worse
    # performance, but works everywhere.
    # Log.find(:all).sample(n)
  end

  # Find logs that match the given phrase, starting at the given location and
  # returning the given amout. Returns a pair of the logs that were found and a
  # Boolean value indicating whether the end of the search results has been
  # reached.
  def self.search(phrase, start, count)
    if phrase
      end_ = [start + count, 1000].min
      # Get one extra element to see if there are any more.
      result = (find :all, :conditions => ['transcript LIKE ?', "%#{phrase}%"],
         :limit => end_ + 1)[start...end_ + 1]
      # The first element is the chat logs, the second tell you if there are
      # more.
      [result[0..-2], end_ < 1000 && result.length == count + 1]
      # Something like this would only match complete words, but it requires
      # an SQLite plugin.
      #(find :all, :conditions => ['transcript REGEXP ?', "\\w#{phrase}\\w"],
      #  :limit => end_)[start...end_]
    else []
    end
  end

  # Adds of vote of the give type to the log with the given url. Logs the ip of
  # the voter, and doesn't register the vote if they have voted on this log
  # before. Returns the new number of votes.
  def self.vote_by_url(url, type, ip)
    log = find_by_url url
    vote = Vote.new :log => log
    vote.ip = ip
    if vote.save
      log.increment!(type)
      log.send(type)
    end
  end
end
