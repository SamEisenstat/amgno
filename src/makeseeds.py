import os
import re

header = """
def seed_logs
  count = 0
  ActiveRecord::Base.transaction do
"""
# ActiveRecord::Base.connection().execute("BEGIN;
record = """
log = Log.find_or_create_by_url(:url => 'http://l.omegle.com/{0}')
log.update_attributes :public_url => 'http://logs.omegle.com/{1}',
  :transcript => '{2}'
puts count += 1
"""
#"""
#IF (SELECT COUNT(*) FROM logs WHERE url = '{0}') != 0
#  UPDATE logs SET public_url = '{1}' WHERE url = '{0}'
#ELSE
#  INSERT INTO logs (url, public_url, transcript, reported, upvotes, downvotes)
#            VALUES ('{0}', '{1}', '{2}', 0, 0, 0);
#"""
footer = """
  end
end
"""
# COMMIT TRANSACTION;")

srcdir = os.path.dirname(os.path.abspath(__file__))

def make_seeds(folder):
  with open(srcdir + '/../db/seed-logs.rb', 'w') as seed_logs:
    seed_logs.write(header)
    
    files = os.listdir(folder)
    for file_ in files:
      match_object = re.match('^(.*)\.png$', file_)
      if match_object != None:
        base_name = match_object.group(1)
        try:
          with open(folder + base_name + '.txt.fixed') as f:
            transcript = f.read()
        except:
          transcript = ''
        seed_logs.write(record.format('http://l.omegle.com/'+file_,
          'http://logs.omegle.com/'+base_name, transcript))

    seed_logs.write(footer)

if __name__ == '__main__':
  make_seeds(srcdir + '/../../test')

