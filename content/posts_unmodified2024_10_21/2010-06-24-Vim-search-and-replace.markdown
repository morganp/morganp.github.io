---
layout: post
title: "Vim search and replace"
date: 2010-06-24 09:37:37 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Vim
discuss_url: //45
url: //45/Vim_search_and_replace
id: 45
---
To search in Vim just press (apple-f for macvim) / then search string.  

    /search

This will highlight all occurrences of 'search', to clear the highlighting enter:

    :let @/ = ""

To search and replace the first occurrence on this line only:
  
    :s/search/replace/

Lines 1 to 10 all instance per line (thats the /g global):

    :1,10 s/search/replace/g 

All Lines All instances

    :%s/search/replace/g 

[Originals source][src]<br  />
[Stack overflow vim clear question][clear]
[src]: http://www.linux.com/learn/tutorials/8255-vim-tips-the-basics-of-search-and-replace
[clear]: http://stackoverflow.com/questions/657447/vim-clear-last-search-highlighting
