---
layout: post
title: "Vim: Status line"
date: 2013-12-17 19:04:42 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Vim
discuss_url: //244
url: //244/Vim%3A_Status_line
id: 244
---
Deciding to see if I could make my vim status line a bit more practical for myself. I decided to try having the modification '[+]' warning as the first thing on the line. I do not want the rest of the line jumping about when it changes from empty to +, using min widths that should be no problem:

    " m is the [+] when modified
    set statusline=-%-01h-%10m-%-01r

This becomes empty except the  '- - -' when no flags are set, from :help statusline 

> When all items in a group becomes an empty string (i.e. flags that are
> not set) and a minwid is not set for the group, the whole group will
> become empty.  This will make a group like the following disappear
> completely from the statusline when none of the flags are set. >
>          :set statusline=...%(\ [%M%R%H]%)...

[The answer (source)](http://got-ravings.blogspot.co.uk/2008/08/vim-pr0n-making-statuslines-that-own.html)

    You can also group several items together and apply formatting 
    to the group as a whole. To do this, use the %(...%) syntax. 
    For example: %20(%l/%L%) would display<current-line>/<total-lines> 
    at a minimum width of 20 characters.

Winner: create a group with %width( ... %)

    " m is the [+] when modified
    set statusline=%10(-%h-%m-%r%)
