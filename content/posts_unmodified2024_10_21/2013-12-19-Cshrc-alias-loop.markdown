---
layout: post
title: "Cshrc alias loop"
date: 2013-12-19 22:04:45 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
discuss_url: //245
url: //245/Cshrc_alias_loop
id: 245
---
Here are some aliased commands which stop line wrapping on really long lines, making the output much more readable:

    # Stop line wrapping
    alias ll '(tput rmam; ls -lFh  \!*; tput smam)'
    alias la '(tput rmam; ls -lAFh \!*; tput smam)'

    alias tree '(tput rmam; tree \!*; tput smam)'

In use:

    $ tree
    Alias loop

The trick is to pre-pend "" to the command
 
    alias tree '(tput rmam; ""tree \!*; tput smam)'

[source](http://docstore.mik.ua/orelly/unix/upt/ch10_06.htm)
