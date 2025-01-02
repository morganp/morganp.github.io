---
layout: post
title: "Vimfu Reindent"
date: 2011-04-19 19:55:19 +0100 
comments: true
sharing: true
footer: true
Category: Tech
tags: Programming, Vim,
discuss_url: //101
url: //101/Vimfu_Reindent
id: 101
---
The latest addition to [my .vimrc][vimrc] below, allows ;g to smart indent the current file. It is the same as gg=G but returning you to the same position. 

Update based on Recommendations from [Drew Neil][drew] and [Jonathan Palardy][jon], a more generic pereserving state function, which can be mapped to a key sequence with specific commands.

    function! Preserve(command)
      " Preparation: save last search, and cursor position.
      let _s=@/
      let l = line(".")
      let c = col(".")
      " Do the business:
      execute a:command
      " Clean up: restore previous search history, and cursor position
      let @/=_s
      call cursor(l, c)
    endfunction

    " SmartIndent keeping cursor position
    map ;g :call Preserve("normal! gg=G")<CR>


If this does not work for a particular file type you use you probably need to look at getting a *.syntax file for your language.



My Original Method 
------------------

    function! Indent()
      " Capture Current Line
      let currentline_num = line(".")
      let currentcol_num = virtcol('.')

      " Reindent from start to end of file
       normal! gg=G

       " Restore Current Line and column
       exe 'normal '.currentline_num.'G'.currentcol_num.'|'
    endfunction
     
    "assign to ;g in normal mode
    map ;g :call Indent()<CR>



[vimrc]: https://github.com/morganp/dotfiles/blob/master/dotfiles/.vimrc#L197
[drew]: http://drewneil.com/
[jon]: http://technotales.wordpress.com/2010/03/31/preserve-a-vim-function-that-keeps-your-state/
