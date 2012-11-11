class ReportsController < ApplicationController
  include Base64Helper

  def create
    params[:url] = base64_url_decode(params[:url])
    report = Report.new_from_ajax_request params
    if report.save
      head :ok
    else
      head :forbidden
    end
  end
end
