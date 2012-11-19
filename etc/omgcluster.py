from scipy import *
from scipy.sparse import *
from scipy.sparse.linalg import *
import spellcheck
import glob
import collections

def data(folder):
    # or should we use a different folder and drop the .fixed?
    files = glob.glob(folder+'/*.txt.fixed')
    words = {}
    for i, word in enumerate(set(spellcheck.all_words(folder, '.fixed'))):
        words[word] = i
    D = dok_matrix((len(files), len(words)), dtype=double)
    for i, fname in enumerate(files):
        file_counts = collections.Counter(spellcheck.file_words(fname))
        for word in file_counts:
            D[i,words[word]] = file_counts[word]
    return D

