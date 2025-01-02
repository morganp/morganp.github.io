---
layout: post
title: "Matlab Shuffle Array"
date: 2014-03-06 20:42:57 +0000
comments: true
categories: Engineering
tags:
- Matlab
---
To shuffle a:

    a(randperm(length(a)))

Example:

    a = [10 2 5 20];
    a = a(randperm(length(a)))
    
    a =

     5    10     2    20

[Source](http://www.mathworks.co.uk/matlabcentral/newsreader/view_thread/239478).
