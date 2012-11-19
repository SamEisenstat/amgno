#import subprocess
import os
import Levenshtein
import string
import copy

ends = string.split(string.strip("""
You have disconnected.
Your conversational partner has disconnected.
Stranger 1 has disconnected.
Stranger 2 has disconnected.
loves you.
was lost. Sorry. :(.
Technical error: Lost connection with server. Sorry. :(.
Techincal error: server disconnected.
you hate it now, by Omegle still loves you.
Technical error: Internal error.
Technical error: lost contact with server.
Sorry. :(.
Sorry. :( Omegle understands if you hate it now, but Omegle still loves you.
"""), "\n")
end_freqs = {}

def distance(tup):
    return tup[3]

matches = []
#for fname in subprocess.call(["ls", "test/*.txt"]):
for fname in os.popen("ls test/*.txt"):
    for line in os.popen("tac "+fname):
        line = string.strip(line)
        match = max([(fname, line, end, Levenshtein.ratio(line, end)) for end in ends], key = distance)
        if distance(match) >= 0.7:
            matches.append(match)
            break

end_groups = []
for end in ends:
    group = [match for match in matches if match[2] == end]
    end_groups.append((end, group, len(group)))

