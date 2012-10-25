import urllib

for i in range(16**6):
    try:
        target = "%06x" % i
        page = urllib.urlopen("http://l.omegle.com/"+target+".png")
        if page.getcode() == 200:
            pic = page.read()
            print target
            with open("logs/"+target+".png", "w") as file:
                file.write(pic)
        page.close()
    except:
        pass
