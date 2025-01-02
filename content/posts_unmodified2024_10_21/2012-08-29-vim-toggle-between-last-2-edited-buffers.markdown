---
layout: post
title: "#vim toggle between last 2 edited buffers"
date: 2012-08-29 11:22:06 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Vim
discuss_url: //187
url: //187/%23vim_toggle_between_last_2_edited_buffers
id: 187
---
    ctrl-6

Demo
==

For the example we will create 3 new temp files and then open them in vim.

    touch vim_test1.txt
    touch vim_test2.txt
    touch vim_test3.txt
    vim vim_test*

From with in vim

    :ls 
    1 %a   "vim_test1.txt"                line 2
    2      "vim_test2.txt"                line 0
    3      "vim_test3.txt"                line 0

Buffer 1 is active (%a) if we jump to buffer 3 

    :b3
    :ls
    1 #    "vim_test1.txt"                line 2
    2      "vim_test2.txt"                line 0
    3 %a   "vim_test3.txt"                line 2

Buffer 3 is active (%a) and 3 is previous edited buffer. ctrl-6 will switch these around. Toggling the active buffer between the two.

    ctrl-6
    :ls
    1 %a   "vim_test1.txt"                line 2
    2      "vim_test2.txt"                line 0
    3 #    "vim_test3.txt"                line 2 
    ctrl-6
    :ls
    1 #    "vim_test1.txt"                line 2
    2      "vim_test2.txt"                line 0
    3 %a   "vim_test3.txt"                line 2  

To scroll through the buffers in order:

    :bn (Next Buffer)
    :bp (Previous Buffer)


