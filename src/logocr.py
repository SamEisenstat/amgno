import re, os

for fname in os.listdir("logs"):
    if re.match(".*png", fname):
        fnum = fname[0:-4]
        os.system("tesseract logs/%s.png logs/%s" % (fnum, fnum))
