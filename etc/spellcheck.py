import re
import glob
from collections import defaultdict, deque, namedtuple, Counter
import operator
import string
import Levenshtein

# fix_string :: str -> str
# Replaces | with l, which is a common OCR error, and replaces fancy ligatures
# with plain ascii.
subchar = {'|': 'l', '\xef\xac\x81': 'fi', '\xef\xac\x82': 'fl',
           '\xe2\x80\x98': "'", '\xe2\x80\x99': "'", '\xe2\x80\x9c': '"',
           '\xe2\x80\x9d': '"'}
badchar = '|'.join([re.escape(char) for char in subchar.keys()])
badchar_re = re.compile(badchar)
def fix_char(char):
    return subchar[char.group(0)]
def fix_string(line):
    line = string.replace(line, "''", '"')
    line = string.replace(line, 'http2ii', 'http://')
    line = string.replace(line, 'httpzii', 'http://')
    line = string.replace(line, '.oom', '.com')
    line = string.replace(line, '.comI', '.com/')
    line = string.replace(line, '.comi', '.com/')
    line = string.replace(line, '.coml', '.com/')
    line = string.replace(line, '.com|', '.com/')
    return re.sub(badchar_re, fix_char, line)

word_re = re.compile(r"(?:\w|'|[\x80-\xff])+")
def file_words(fname):
    words = []
    for line in file(fname):
        line = fix_string(line)
        words += re.findall(word_re, line)
    return words

def for_pattern(fun, pattern):
    return [fun(fname) for fname in glob.iglob(pattern)]

#def perturb(hyp):
#    word, ll = hyp
#    splits = [(word[:i], word[i:]) for i in range(len(word) + 1)]
#    return set((split, ll[:] + ('split', i))
#            for (i, split) in enumerate(splits))

#def hypotheses(word):
#    queue = deque([word])
#    result = []
#    while queue:
#        hyp = queue.popleft()
#        if hyp in dictionary:
#            result.append(hyp)
#        do_stuff_with(hyp)
#    return result

#words = for_pattern(file_words, 'test/*.txt')
#corpus = Counter(dictionary_list)
#corpus.update([word for word in words if word in dictionary])
#bad_words = [w.lower() for w in words
#    if not w.isdigit() and w.lower() not in dictionary]
#bad_word_counts = Counter(bad_words)
#
#def ldm(word):
#    return lambda dictionary_word: Levenshtein.ratio(word, dictionary_word)
#
#acc = []
#for word in set(bad_words):
#    acc.append((word, max(dictionary, key=ldm(word)), bad_word_counts[word]))

dictionary_list = [word.strip().lower()
    for word in file('/usr/share/dict/words')]
dictionary = set(dictionary_list)
correction_list = {}
for line in file('correction-list'):
    mapping = string.split(line.strip(), maxsplit=1)
    correction_list[mapping[0]] = mapping[1]
dictionary.update(correction_list.values())
def correct(match):
    word = match.group(0)
    normed_word = word.lower()
    if normed_word in correction_list:
        new_word = correction_list[normed_word]
        if word.isupper():
            return new_word.upper()
        else:
            edits = Levenshtein.editops(normed_word, new_word)
            return Levenshtein.apply_edit(edits, word, new_word)
    elif normed_word in dictionary:
        return word
    else:
        return word

def correct_file(fname):
    with file(fname+'.fixed', 'w') as outfile:
        for line in file(fname):
            line = fix_string(line)
            line = re.sub(word_re, correct, line)
            outfile.write(line)

