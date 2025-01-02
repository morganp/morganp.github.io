---
layout: post
title: "Fixing Ncursers on OS X 10.6.3+"
date: 2010-12-13 13:59:47 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- OS X
discuss_url: //82
url: //82/Fixing_Ncursers_on_OS_X_10.6.3%2B
id: 82
---
Currently OS X 10.6.3 - 10.6.5 the ncursers library is broken. A hacky fix is to copy the libraries from 10.6.2. I have put my working copies in a public drop box.

    $ sudo cp /usr/lib/libncurses.5.dylib /usr/lib/libncurses.5.dylib.backup
    $ sudo cp /usr/lib/libncurses.5.4.dylib /usr/lib/libncurses.5.4.dylib.backup

    $ cd /usr/lib/
    $ sudo wget http://dl.dropbox.com/u/8462176/osx-10-6-working-ncurse/libncurses.5.dylib
    $ sudo wget http://dl.dropbox.com/u/8462176/osx-10-6-working-ncurse/libncurses.5.4.dylib

Wget can be installed with [homebrew][]:

    $ brew install wget

The Ideas for the fix came from [source][].

[homebrew]: https://github.com/mxcl/homebrew
[source]: http://www.uponmyshoulder.com/blog/2010/os-x-10-6-3-broke-ncurses/
