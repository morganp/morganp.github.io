---
layout: post
title: "Vim Code Folding"
date: 2013-01-22 16:37:17 +0000 
comments: true
sharing: true
footer: true
Category: Tech
tags: Vim,
discuss_url: //210
url: //210/Vim_Code_Folding
id: 210
---
To enable code folding in Vim type (from normal mode):

    :set foldmethod=marker
   
Or add this to your `.vimrc`

    set foldmethod=marker

Now anything contained with in `{{{` and `}}}` will be folded.

Commands
--

From Normal mode

unfold `zo` (open)  
fold  `zc` (collapse)  
unfold all `zr`  
Fold all `zm`  

Read more on [vim wiki][]

[vim wiki]: http://vim.wikia.com/wiki/Folding
