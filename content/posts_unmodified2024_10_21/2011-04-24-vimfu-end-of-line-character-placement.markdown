---
layout: post
title: "vimfu end of line character placement"
date: 2011-04-24 12:07:07 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Vim
discuss_url: //102
url: //102/vimfu_end_of_line_character_placement
id: 102
---
In Vim to insert text before the cursor press 'i', to insert text after cursor 'a' or to edit at the end of line 'A'. To paste before the cursor 'p' to paste after the cursor 'P'. 

While these variants exist I still find it easier to place the cursor 'correctly' and use one variant. However this results in a little trouble with end of lines as I can not move the cursor to paste 'P' after the last character.

Adding the following line to [my .vimrc][github] has helped me work around this:

    " Allow cursor to move 1 character past end of line
    set virtualedit=onemore


[github]: https://github.com/morganp/dotfiles/blob/master/dotfiles/.vimrc
