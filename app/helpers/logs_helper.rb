module LogsHelper
  # Creates an array of nice hashes that represent each occurrence of the
  # phrase in the text.
  def matches(text, phrase)
    text = h text
    result = []
    start = end_ = 0
    phrase_re = Regexp.new(Regexp.escape(phrase), Regexp::IGNORECASE)
    text.scan(phrase_re) do
      result << {
        :line => text[0...start].count('\n'),
        :text => excerpt(text[end_..-1], phrase, :radius => 40,
                         :separator => ' ').
                   gsub(phrase_re, '<strong class="highlight">\0</strong>').
                   html_safe}
      start, end_ = Regexp.last_match.offset(0)
    end
    result
  end
end
