import urllib
import contextlib
import StringIO
import Image
import os
import random

def getlog(log, folder):
	if log+".txt" in saved_logs:
		return False
	with contextlib.closing(urllib.urlopen("http://l.omegle.com/"+log+".png")) as page:
		if page.getcode() != 200:
			return False
		print "Resizing image"
		pic = Image.open(StringIO.StringIO(page.read()))
		_, _, width, height = pic.getbbox()
		pic = pic.resize((width*2, height*2), Image.NEAREST)
		print "OCRing"
		basename = folder+"/"+log
		fname = basename+".png"
		pic.save(fname)
		os.system("tesseract "+fname+" "+basename)
		print "Done\n"
		return True

def padhex(num, digits):
	return ("%0"+str(digits)+"x") % num

def scanlogs(digits, folder, start=0, stop=None):
	if stop == None:
		stop = 16**digits
	for i in range(start, stop):
		try:
			getlog(padhex(i, digits), folder)
		except:
			pass

def randomlogs(digits, folder):
	while True:
		try:
			getlog(padhex(random.randint(0, 16**digits - 1), digits), folder)
		except:
			pass

folder = "../../test"
saved_logs = set(line.strip() for line in open(folder+"/saved-logs.txt"))
randomlogs(5, "../../test")

