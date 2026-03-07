---
layout: post
title: "Check you current Vim colorscheme"
date: 2013-12-20 19:43:16 +0000 
comments: true
sharing: true
footer: true
Category: Unix & Tools
tags: Vim
discuss_url: //246
id: 246
---
This is not a foolproof method, as vim colorschemes are just vim commands but by default they set:

    let g:colors_name = "ir_black"

so to find out from vim just run

    :echo g:colors_name

Or even simpler suggestion from farfanoide

    :colorscheme


