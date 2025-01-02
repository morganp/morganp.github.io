---
layout: post
title: "Matlab: linear progressions"
date: 2015-06-10 20:19:05 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Matlab
---

Progressions can be created using the [Colon][] operator

    min   = 10
    max   = 100
    steps = 20

    step_size = (max-min)/steps

    i = min:step_size:max

Alternatively [linspace][] can be used:


    min   = 10
    max   = 100
    steps = 20

    i = linspace(min,max,steps)

This also allows for easily switching to a log scale using [logspace][].

[Colon]: http://uk.mathworks.com/help/matlab/ref/colon.html
[linspace]: http://uk.mathworks.com/help/matlab/ref/linspace.html
[logspace]: http://uk.mathworks.com/help/matlab/ref/logspace.html
