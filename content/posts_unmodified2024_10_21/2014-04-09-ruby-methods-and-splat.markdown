---
layout: post
title: "Ruby Methods and Splat"
date: 2014-04-09 19:47:47 +0100
comments: true
categories: 
- Tech
tags:
- Programming
- Ruby
comments: true
sharing: true
footer: true
---

Ruby methods can set default values for optional arguments:

    def commit(path=Dir.pwd)


To take an optional number of arguments a splat can be used:

    def amethod( *arg1 )

The Problem is now to set defaults or require a set number of arguments. 

1. Splat arguments can not be defaulted.
2. The splat can accept zero arguments.

The following might be what you would expect for a default in a splat, but this conflicts with its abilliy to accept 0 arguments.
     
    def commit(*path=[Dir.pwd]) ##THIS DOES NOT WORK

Splats can follow other arguments. To require at least one argument:

    def add(files, *files_splat)

No arguments required but the first has a default:
    
    def commit(path=Dir.pwd, *path_splat)

These also work as expected in Thor for parsing command line options. I have used them in my [dssx](https://github.com/morganp/dssx) gem.

In thor I also add this to the start of my methods to combine `path` and `path_splat` which are strings:

    path_list = path + ' ' + path_splat * ' '
