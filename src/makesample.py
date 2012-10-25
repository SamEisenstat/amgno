import os
import glob
import random

def make_sample(name, source, size):
    os.system('mkdir '+name)
    fnames = random.sample(glob.glob(source+'/*.txt'), size)
    os.system('cp -t'+name+' '+(' '.join(fnames)))

make_sample('sample', 'test', 1000)
