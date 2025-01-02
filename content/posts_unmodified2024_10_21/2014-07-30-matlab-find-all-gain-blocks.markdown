---
layout: post
title: "Matlab: Find all gain blocks"
date: 2014-07-30 19:58:53 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Matlab
- Simulink
---

    find_system('BlockType', 'Gain')

This will list all gain blocks in currently loaded models. to limit to a particulat model:

    find_system('testharness', 'BlockType', 'Gain')

[From Mathworks](http://www.mathworks.co.uk/help/simulink/slref/find_system.html).
