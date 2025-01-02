---
layout: post
title: "Shell redirection"
date: 2014-06-19 20:10:57 +0100
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- Programming
- Bash
- Tcsh
- Command Line
published: true
---
To redirect stdout and stderr in bash we use:

    ./ShellFile.sh &> test.log

However in tcsh that results in: 

    Invalid null command.

Switch the order of `&` and `>` in tcsh :

    ./ShellFile.sh >& test.log
