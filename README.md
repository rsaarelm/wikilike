PlainWiki is a wiki you use from a text editor. There is no browser
view. The pages are plaintext files, hyperlinks are indicated by
WikiWord case in text, and you navigate between files with your text
editor's "open file name under cursor" command.

The existing configuration is for Vim, which has `gf` for the open
file under cursor command and `C-o` for returning to the previous
open file.

To install the Vim syntax extensions:

    mkdir -p ~/.vim
    cp -r vim/* ~/.vim

Since the wiki page files have no file extensions, Vim will use the
path `*/wiki/*` leading up to them to activate the wiki syntax.

It's expected that the wiki lives under version control and has
daily commits done whenever it's being edited, so the wiki edit
history can be recovered using version control history.

The wikitool.py script has useful commands for checking for wiki
page connectivity and saving snapshots of the wiki state to git.
