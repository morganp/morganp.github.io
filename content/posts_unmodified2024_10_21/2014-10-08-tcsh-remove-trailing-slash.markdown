---
layout: post
title: "tcsh Remove trailing /"
date: 2014-10-08 21:15:43 +0100
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- Programming
---


    #!/bin/tcsh

    set var = "helloworld/"

    ## http://dbaspot.com/shell/350417-sed-removing-trailing.html
    set var = `echo "$var" | sed -e 's,\(.\)/$,\1,'`

    echo $var
