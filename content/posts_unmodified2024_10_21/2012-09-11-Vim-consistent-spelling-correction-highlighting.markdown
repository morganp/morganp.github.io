---
layout: post
title: "Vim consistent spelling correction highlighting"
date: 2012-09-11 11:09:36 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Vim
discuss_url: //192
url: //192/Vim_consistent_spelling_correction_highlighting
id: 192
---
In gvim and mvim incorrect spellings are highlighted with a squiggly underscore ala MS Word. vim in a terminal (xterm) will highlight the word be default. The following snippet can be added to your .vimrc file after setting your colorscheme. If you do not set a colorscheme then you are likely using the default and this could be placed any where.

To highlight terminal (xterm) spelling mistakes with an underline rather than a background colour and keep the squiggly underlining in graphical vim:

    " Spellings Underline instead of highlight "
    highlight clear SpellBad
    highlight SpellBad cterm=underline 
    " GVIM/MVIM squiggle underline "
    highlight SpellBad gui=undercurl

