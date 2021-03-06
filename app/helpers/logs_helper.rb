module LogsHelper
  # Creates an array of nice hashes that represent each occurrence of the
  # phrase in the text.
  def matches(text, phrase)
    text = text.gsub(/\n+/, "\n")
    text = h text
    phrase = h phrase
    result = []
    start = end_ = 0
    phrase_re = Regexp.new(Regexp.escape(phrase), Regexp::IGNORECASE)
    text.scan(phrase_re) do
      old_end = end_
      start, end_ = Regexp.last_match.offset(0)
      result << {
        :line => text[0...start].count("\n"),
        :text => excerpt(text[old_end..-1], phrase, :radius => 40,
                         :separator => ' ').
                   gsub(phrase_re, '<strong class="highlight">\0</strong>').
                   gsub("You:", '<strong class="highlight you-result">\0</strong>').
                   gsub("Stranger:", '<strong class="highlight stranger-result">\0</strong>').
                   gsub("\n", "<br>").
                   html_safe}
      
      # Don't keep going if there are too many results, to save server time.
      if result.length >= 100
        break
      end
    end
    result
  end

  # Creates a sharable link to a log.
  def log_link(log)
    "http://www.omegrep.com"+log_path(log)
  end

  # Displays a flag icon, and records the url of a log to be flagged
  def show_flag(log)
    "<i class=\"icon-flag flag-chat\" data-url=\"#{h log.url}\"></i>".html_safe
  end
end
