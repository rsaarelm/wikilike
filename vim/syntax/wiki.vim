" Vim syntax file
" Language: rsaarelm wiki
" Maintainer: Risto Saarelma
" Latest Revision: 2015-06-15

if exists("b:current_syntax")
  finish
endif

" Variant that allows numbers as well as Wiki Words.
" This is needed for the Bibtex Authorlastname2012ArticleName citation id
" format.
syn match wikiWord '\u\l\+\(\(\d\)\+\|\(\u\l\+\)\)\+'

" Original strict wikiwords
"syn match wikiWord '\(\u\l\+\)\{2,}'

hi def link wikiWord Underlined
