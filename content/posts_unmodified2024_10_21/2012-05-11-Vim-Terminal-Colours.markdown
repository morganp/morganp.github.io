---
layout: post
title: "Vim Terminal Colours"
date: 2012-05-11 19:55:25 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Vim
discuss_url: //160
url: //160/Vim_Terminal_Colours
id: 160
---
I use the [ir_black][] for vim ([MacVim][] mainly). Recently have been doing a lot of work in the terminal over ssh and have constantly been having to switch colouscheme to dessert, just to see the text properly.

    :colorscheme desert

The vimrc Which I had copied from some one else used:

    " 8 Colours Modified to 16 Colors
    if &term =~ "xterm"
      if has("terminfo")
        set t_Co=16
        set t_Sf=^[[3%pl%dm
        set t_Sb=^[[4%pl%dm
      else
        set t_Co=16
        set t_Sf=^[[3%dm
        set t_Sb=^[[4%dm
      endif
    endif

It turns out that if I had realised this came from: `:help xterm-color` and read it. For 16 colours it recommends:

    " 16 Colours
    if &term =~ "xterm"
      if has("terminfo")
        set t_Co=16
        set t_AB=%?%p1%{8}%<%t%p1%{40}%+%e%p1%{92}%+%;%dm
        set t_AF=%?%p1%{8}%<%t%p1%{30}%+%e%p1%{82}%+%;%dm
      else
        set t_Co=16
        set t_Sf=%dm
        set t_Sb=%dm
      endif
    endif

Which is now working well. It also recommends some things for 256 colour but that just filled my terminal with Color escape codes. 

[ir_black]: http://blog.infinitered.com/entries/show/8
[MacVim]: http://code.google.com/p/macvim/
