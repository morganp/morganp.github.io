---
layout: post
title: "Get snipMate working, a #vim plugin"
date: 2012-09-05 00:45:31 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Vim
discuss_url: //191
url: //191/Get_snipMate_working%2C_a_%23vim_plugin
id: 191
---
[snipMate][] is a useful vim plugin which allows short cuts like for'tab' to be set up which will insert the snippet:

    for (i = 0; i < count; i++) {  
    
    } 

To install you just have to download the the zip file from [snipMate][] and copy the files into your vim folder (~/.vim).

Make sure you have this in your .vimrc file

    filetype plugin on

[snipMate]: http://www.vim.org/scripts/script.php?script_id=2540

I still could not get tab completion to work. running `:scriptnames` inside vim will list the files it has loaded and should include:

    plugin/snipMate.vim
    after/plugin/snipMate.vim

On my first install the plugin/snipMate.vim was not executable and therefore the after/plugin/snipMate.vim did not get loaded.

The Fix
--

    cd ~/.vim 
    chmod ugo+x plugin/snipMate.vim
