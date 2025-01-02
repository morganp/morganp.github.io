---
layout: post
title: "[vim] Indenting with Vim "
date: 2010-07-07 07:50:53 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Vim
discuss_url: //50
url: //50/%5Bvim%5D_Indenting_with_Vim_
id: 50
---
Vim is a great text editor but has quite a steep learning curve. [VimCasts][vimcast] is a great podcast for learning about vim. 

Indenting is a common programming activity so doing this effectively can greatly speed editing up.

Pressing i to enter INSERT mode then pressing tab will insert a tab or white space as expected. There is a quicker method especially for multiline.

<strong>Vim Multi-Line Indent</strong>
Press ESC to enter normal mode. 'v' to enter Visual mode. use the cursors or your normal navigation keys to highlight multiple lines then press '<<' or '>>'. This indents in or out but notice that you have gone back to normal mode and your higlighted region has been lost. this is quite frustrating until you realise that you can redo the same command by pressing '.' and undo with 'u' if you indented to far.

[vimcast]: http://vimcasts.org
