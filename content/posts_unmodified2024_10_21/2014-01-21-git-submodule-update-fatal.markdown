---
layout: post
title: "git submodule update fatal"
date: 2014-01-21 20:32:16 +0000
comments: true
categories: Tech
tags:
- Git
---


    $ git submodule update
    fatal: Needed a single revision
    Unable to find current revision in submodule path 'vim/bundle/systemverilog'

To resolve the issue : 

    rm -rf vim/bundle/systemverilog
    git submodule update

Check your .gimodules, one of mine was an http instead of https, (gitub is https only now).
Update to the latest version I find a minimum of git 1.8.5 is required for reliable module checkout.

Solution based [on gostais docs](http://www.gostai.com/downloads/urbi-sdk-2.0/doc/urbi-sdk.htmldir/faq.html#x22-10400014.1.4).
