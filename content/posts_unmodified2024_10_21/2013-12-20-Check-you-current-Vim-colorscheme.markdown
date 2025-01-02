---
layout: post
title: "Check you current Vim colorscheme"
date: 2013-12-20 19:43:16 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Vim
discuss_url: //246
url: //246/Check_you_current_Vim_colorscheme
id: 246
---
This is not a foolproof method, as vim colorschemes are just vim commands but by default they set:

    let g:colors_name = "ir_black"

so to find out from vim just run

    :echo g:colors_name

Or even simpler suggestion from farfanoide

    :colorscheme


