---
layout: post
title: "Submit to SGE as if working locally"
date: 2014-07-30 20:13:23 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- SGE
---


Setting an alias in you .tcshrc

    alias qrun 'qrsh -V -noshell -cwd !*'

or bash 

    alias qrun='qrsh -V -noshell -cwd !*'

Which makes submitting any script to the grid just:

    qrun helloworld.sh

Originally asked on [superuser](http://superuser.com/a/751162/42141).
