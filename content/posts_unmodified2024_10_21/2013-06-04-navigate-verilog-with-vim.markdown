---
layout: post
title: "Navigate Verilog with VIM"
date: 2013-06-04 21:08:39 +0000
comments: true
categories: Engineering
tags:
- Vim
- Verilog
---

Using `gf`
==

In your vimrc

    " gf goto_file, automatically add search for these file extensions
    :set suffixesadd+=.v
    :set suffixesadd+=.sv
    :set suffixesadd+=.bh.v


Now `gf` on a module name will try to open file.v file.sv and file.bh.v  if they are in the same folder.
Another good reason to keep module and file names matching.

`ctrl-6` will jump back to the previous file.
