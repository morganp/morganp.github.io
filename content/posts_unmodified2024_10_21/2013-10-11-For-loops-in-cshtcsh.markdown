---
layout: post
title: "For loops in csh/tcsh"
date: 2013-10-11 12:25:42 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Linux
discuss_url: //235
url: //235/For_loops_in_csh%2Ftcsh
id: 235
---
To count from 1 up to 20 in steps of 5

    #!/bin/csh
    foreach x (`seq 1 5 20`)
      echo $x
    end
