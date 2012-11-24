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

  # The following sucks
  @score_sql = <<END
    upvotes - downvotes DESC
END
  # The following requires an SQL that supports SQRT
  #<<END
  #  (CASE WHEN upvotes = 0 THEN
  #    0
  #  ELSE
  #    (-1.96 * SQRT(upvotes*downvotes/(upvotes+downvotes) + 0.9604)
  #                   + upvotes + 1.9208)
  #                           /
  #            (upvotes + downvotes + 3.8416)
  #  END)
  #  DESC
#END

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
    return [[], true] unless phrase

    end_ = [start + count, 1000].min
    # Get one extra element to see if there are any more.
    result = (find :all, :conditions => ['transcript LIKE ?', "%#{phrase}%"],
       :limit => end_ + 1, :order => @score_sql)
    # The first element is the chat logs, the second tell you if there are
    # more.
    [result[start...end_], end_ < 1000 && result.length == end_ + 1]
    # Something like this would only match complete words, but it requires
    # an SQLite plugin.
    #(find :all, :conditions => ['transcript REGEXP ?', "\\w#{phrase}\\w"],
    #  :limit => end_)[start...end_]
  end

  # Get the chats with the highest scores
  def self.get_top(start, count)
    end_ = start + count
    result = Log.find :all, :order => @score_sql, :limit => end_
    result[start...end_]
  end

  # Adds of vote of the give type to the log with the given url. Logs the ip of
  # the voter, and doesn't register the vote if they have voted on this log
  # before. Returns the new number of votes.
  def self.vote_by_url(url, type, ip)
    log = find_by_url url
    vote = Vote.new :log => log, :vote_type => type
    vote.ip = ip
    if vote.save
      log.increment!(type)
      log.send(type)
    end
  end
end
