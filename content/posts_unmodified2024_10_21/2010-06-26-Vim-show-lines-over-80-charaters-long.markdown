---
layout: post
title: "Vim show lines over 80 charaters long."
date: 2010-06-26 07:13:52 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Vim
discuss_url: //46
url: //46/Vim_show_lines_over_80_charaters_long.
id: 46
---
This snippet can be added to you ~/.vimrc to highlight long lines.

    " Highlight lines over 80 characters long with red background
    highlight OverLength ctermbg=red ctermfg=white guibg=#592929
    match OverLength /\%81v.\+/

When programming it is recommended to keep lines at 80 characters or under. This makes it easier to find the start of the next line, possible to compare two files side by side on modern monitors and source code should print out nicely if required for code reviews.

[source][]

[source]: http://stackoverflow.com/questions/235439/vim-80-column-layout-concerns
