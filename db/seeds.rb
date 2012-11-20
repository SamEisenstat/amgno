# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

class String
  def base_name
    match(/[^0-9a-f]*([0-9a-f]*)[^\/]*$/)[1]
  end
end

logs = Set.new
Log.all.each { |log| logs.add(log.url.base_name) }
count = 0
Dir.glob('../logs/*.fixed').each_slice(100) do |slice|
  ActiveRecord::Base.transaction do
    slice.each do |file|
      base_name = file.base_name
      unless logs.include?(base_name)
        transcript = begin
          IO.read(file.base_name+'.txt.fixed')
        rescue
          nil
        end
        log = Log.new :url => 'http://l.omegle.com/'+base_name+'.png',
          :transcript => transcript
        # I don't do this in one step, as the log doesn't have an id yet.
        log.public_url = base_name
        log.save
      end
    end
  end
  puts count += 1
end

