---
layout: post
title: "Simulink: Globally set sample time"
date: 2014-07-30 20:01:49 +0100
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

To set each constant in a model to sample time -1:

    blks = find_system(dut, 'BlockType', 'Constant');
    for i = 1:length(blks)
        set_param(blks{i}, 'SampleTime', '-1');
     end


[Source](http://www.mathworks.co.uk/help/hdlcoder/ug/resource-sharing.html#btg_5ht-1).
