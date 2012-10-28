# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

class String
  def base_name
    match(/([0-9a-f]*)\.png/)[1]
  end
end

logs = Set.new(Log.all.map { |log| log.url.base_name })
count = 0
Dir.glob('../test/*.png').each_slice(100) do |slice|
  ActiveRecord::Base.transaction do
    slice.each do |file|
      base_name = file.base_name
      unless logs.include?(base_name)
        begin
          transcript = IO.read(file.match(/(.*)\.png/)[1]+'.txt.fixed')
        rescue
          transcript = nil
        end
        log = Log.new :url => 'http://l.omegle.com/'+base_name+'.png',
          :public_url => 'http://logs.omegle.com/'+base_name,
          :transcript => transcript
        log.save
      end
    end
  end
  puts count += 1
end

