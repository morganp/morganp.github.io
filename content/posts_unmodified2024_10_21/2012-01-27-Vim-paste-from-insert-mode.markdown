---
layout: post
title: "Vim, paste from insert mode"
date: 2012-01-27 15:00:55 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Vim
discuss_url: //137
url: //137/Vim%2C_paste_from_insert_mode
id: 137
---
    ctrl-r "

Actually `ctrl-r reg`, where " is the unnamed register from the last yank or delete.

Why
---

If you have done a block selection and you want to paste, normally you would have to leave selection mode to this and there fore not be able to edit multiple lines at once.

say you have (below) and what to prepend 'number'.

    number 
    one
    two
    three

Place cursor on 'number', `yiw` to yank inner word. Move to 'o' of one. `ctrl-v` to enter block selection, `jj` to select ott vertically. Then I to enter insert mode. `ctrl-r " . ESC`.
 
    number 
    number.one
    number.two
    number.three

