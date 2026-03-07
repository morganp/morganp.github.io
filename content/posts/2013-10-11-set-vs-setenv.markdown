---
layout: post
title: "set vs setenv"
date: 2013-10-11 12:34:15 +0100 
comments: true
sharing: true
footer: true
Category: Unix & Tools
tags: Command Line
discuss_url: //236
id: 236
---
setenv allows sub shells to inherit the value.

Set
--

    set x = "twenty"
    echo $x
    > twenty

    ## New Shell
    csh
    echo $x
    x: Undefined variable.


Setenv Note missing '='
--

    setenv x "twenty"
    echo $x
    > twenty

    ##New Shell
    csh
    echo $x
    > twenty

