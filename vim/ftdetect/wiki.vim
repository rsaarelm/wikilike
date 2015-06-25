autocmd BufRead,BufNewFile */wiki/* set filetype=wiki sts=2 tw=78 fo+=tr fo-=r

" Create a new buffer when gf-ing a WikiWord that doesn't have a file yet. 
autocmd BufRead,BufNewFile */wiki/* noremap gf :e <cfile><CR>
