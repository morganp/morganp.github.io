---
layout: post
title: "Matlab: Line Breaks in Strings"
date: 2014-05-28 19:34:30 +0100
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

Wrap strings with `sprintf` to allow the `\n` to be escaped correctly.

    >> disp('hello\nworld')
    hello\nworld

    >> disp(sprintf('hello\nworld'))
    hello
    world

