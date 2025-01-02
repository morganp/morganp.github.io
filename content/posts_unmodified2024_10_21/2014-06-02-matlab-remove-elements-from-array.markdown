---
layout: post
title: "Matlab Remove Elements from Array"
date: 2014-06-02 19:08:09 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Matlab
published: true
---

Removing elements based on index

    A      = 1:10    ; % 1-D array
    A =
     1     2     3     4     5     6     7     8     9    10

    ind    = [1 4 7] ; % indices to be removed
    A(ind) = []      ; % remove

    A =
     2     3     5     6     8     9    10

Based on [Matlab Central][Source].

[Source]: http://www.mathworks.co.uk/matlabcentral/newsreader/view_thread/1486880

