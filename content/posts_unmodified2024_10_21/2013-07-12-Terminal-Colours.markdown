---
layout: post
title: "Terminal Colours"
date: 2013-07-12 19:16:31 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Vim
discuss_url: //226
url: //226/Terminal_Colours
id: 226
---
I have decided to clean up my vim colorschemes. I have been using ir_black for sometime but it does not look the same as others who use it. I think I was forcing it into 256 or 16 color mode.

Some vim command line on some terminals looked awful and I had to switch to another colorscheme just so I could see the text.

I have decided to pick an 8,16,256 and full color scheme and load them automatically, rather than trying to find a colorscheme which degraded gracefully, they just never seemed to do it that well.

From [sanctum.geek.nz][source] I discovered the `tput colors` command. Vims `&t_Co` will reflect this value.  But it only reflects the calling terminals capabilities, so calling gvim or mvim from an 8 bit color terminal your &t_Co will still be 8.

After some trouble getting the 8 colour scheme to work posted a question on [superuser](http://superuser.com/questions/604589/vim-non-gui-background-will-not-go-white). 


The main solution seems to be to append your TERM envar with -256color to force 256 Colour detection.  I was originally hesitant to blindly apply 256 color to any system I may be working on, but I think it would be rare to come across a terminal that does not support 256 colors these days. This would also have to be a system/network where I have already set-up my dotfiles.


Adding -256color to term makes tput return 256 and makes vim t_Co 256 as well.
For csh:

    setenv TERM $TERM-256color

For a bit more protection you should stop multiple -256colors being appended i.e. stop xterm-256color-256color if called from bash with 256color extension already applied.

    if ($TERM =~ *256color*) then
      #Already 256color
    else
      setenv TERM $TERM-256color
    endif

For Bash:

    if [[ "$TERM" != *256color* ]]
    then
      export TERM=$TERM-256color
    fi

Using a [python script][python] you can display color charts in the terminal. It should be clear if 256 colors is not working, you would only see 16 colour blocks.

[ ![colour block](http://farm6.staticflickr.com/5542/9272025578_7a86fc474c_n.jpg) ](http://flickr.com/gp/morgan_prior/45kh8P)

[python]: https://github.com/wardi/xterm_colour_chart
[source]: http://blog.sanctum.geek.nz/tag/xterm-256color/

After all of this instead of getting my vim colour schemes to degrade gracefully I force everything into 256 colours mode. Which I think is actually ok and I get to use better colour schemes all/more of the time.
