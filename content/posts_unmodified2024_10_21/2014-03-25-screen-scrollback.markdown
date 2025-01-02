---
layout: post
title: "Screen Scrollback"
date: 2014-03-25 20:57:28 +0000
comments: true
categories: Tech
tags:
- Command Line
- Screen
---

Enter copy mode

    ctrl-a [

Use cursors of vim motions to move to relevant area.

Space to start selection, space again to end selection and copy to screen copy-buffer

Move to virtual screen terminal where you want to paste then

    ctrl-a ]

To paste to file enter 

    cat > paste.file
    #// Then press ctrl-a ]
 
[More notes on screen scrollback history][screen-history]

[screen-history]: http://commandliners.com/2009/12/screen-working-with-the-scrollback-buffer/
