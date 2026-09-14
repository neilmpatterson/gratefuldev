class TodayController < ApplicationController
  def index
    today = Date.today
    @today_shows = Show.where(month: today.month, day: today.day)
                       .order(year: :asc)
    @date_label = today.strftime("%-B %-d")
    @featured = @today_shows.sample
    @others = @today_shows.reject { |s| s == @featured }
  end
end
