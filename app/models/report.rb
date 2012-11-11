class Report < ActiveRecord::Base
  attr_accessible :log, :message, :report_type

  belongs_to :log
  validates :log, :presence => true

  def self.new_from_ajax_request(params)
    report = new(params[:report])
    report.log = Log.find_by_url params[:url]
    if report.log
      report.log.reported = true
    end
    report
  end
end
