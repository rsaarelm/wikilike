#!/usr/bin/env python3

import re
from os import listdir, system
from os.path import isfile, join
from sys import argv, exit

word_pattern = re.compile(r'\b[A-Z][a-z]+(([0-9])+|([A-Z][a-z]+))+\b')
url_pattern = re.compile('http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+')


class WikiPage:
    def __init__(self, filename):
        self.text = open(filename).read()
        self.links = []

        # Filter out URLs that often have CamelCase crap.
        no_urls = " ".join([x for x in self.text.split() if not url_pattern.match(x)])

        for x in word_pattern.finditer(no_urls):
            self.links.append(x.group(0))

def all_pages():
    result = {}
    path = "wiki/"
    for f in [f for f in listdir(path) if isfile(join(path, f))]:
        if word_pattern.match(f):
            result[f] = WikiPage(f)
    return result

def show_unlinked():
    pages = all_pages()
    everything = set(pages.keys())
    linked = set(['FrontPage'])
    edge = set(pages['FrontPage'].links)
    while edge:
        link = edge.pop()
        if link not in linked:
            linked.add(link)
            if link in pages:
                for new_link in pages[link].links:
                    if new_link not in linked:
                        edge.add(new_link)
    for x in everything - linked:
        print(x)

def show_missing():
    pages = all_pages()
    not_found = set()
    for p in pages:
        for link in pages[p].links:
            if link not in pages:
                not_found.add(link)
    for x in not_found:
        print(x)

def usage(err=0):
    print(
"""usage: %s <command>

Commands:
   unlinked     List pages not reachable from FrontPage
   list         List all wiki pages
   snapshot     Save current state into a git commit
   missing      Links present in pages with no corresponding pages""" % argv[0])
    exit(err)

if __name__ == '__main__':
    if len(argv) < 2:
        usage(1)
    elif argv[1] == 'unlinked':
        show_unlinked()
    elif argv[1] == 'list':
        for x in all_pages(): print(x)
    elif argv[1] == 'snapshot':
        system("git add wiki/")
        system("git commit -m 'Automated snapshot'")
    elif argv[1] == 'missing':
        show_missing()
    else:
        usage(1)
