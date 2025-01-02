---
layout: post
title: "Floating Point Arithmetic is not Associative"
date: 2014-06-19 20:00:45 +0100
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

This can be shown with some easy examples:

    a = 0.1 +  0.2 + 0.3 ;
    b = 0.1 + (0.2 + 0.3);

    sprintf('%.20f', a) % Display with 20 fractional places
    sprintf('%.20f', b)

    ans =
      0.60000000000000008882

    ans =
      0.59999999999999997780

Multiplication examples:

    c = 0.1 *  0.2 * 0.3 ;
    d = 0.1 * (0.2 * 0.3);

    sprintf('%.20f', c)
    sprintf('%.20f', d)

    ans =
    0.00600000000000000099

    ans =
    0.00600000000000000012


By default gcc will not rearrange equations for optimal performance as this would change the accuracy.
The GCC flag `-ffast-math` optimizes equations as if they were associative.

The examples shown here were found on [Hacker News](https://news.ycombinator.com/item?id=7479550).
