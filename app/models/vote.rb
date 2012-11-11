class Vote < ActiveRecord::Base
  attr_accessible :log

  belongs_to :log
  validates :log, :presence => true
  validate :ip_cannot_vote_more_than_once_per_log

  def ip_cannot_vote_more_than_once_per_log
    if Vote.where(:ip =>  ip, :log_id => log.id).length > 0
      errors[:base] << "You can only vote once on each log."
    end
  end
end
