import os
import re

header = """
def seed_logs
"""
record = """
log = Log.find_or_create_by_url(:url => 'l.omegle.com/{0}')
log.public_url = 'logs.omegle.com/{1}'
log.save
"""
footer = """
end
"""

srcdir = os.path.dirname(os.path.abspath(__file__))

def make_seeds(folder):
  with open(srcdir + '/../db/seed-logs.rb', 'w') as seed_logs:
    seed_logs.write(header)
    
    files = os.listdir(folder)
    for file_ in files:
      match_object = re.match('^(.*)\.png$', file_)
      if match_object != None:
        base_name = match_object.group(1)
        if False:
          actually = handle.the('ocr').d(text)
        seed_logs.write(record.format(file_, base_name))

    seed_logs.write(footer)

if __name__ == '__main__':
  make_seeds(srcdir + '/../../test')

