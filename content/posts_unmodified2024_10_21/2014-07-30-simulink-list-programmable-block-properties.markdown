---
layout: post
title: "Simulink: list programmable block properties"
date: 2014-07-30 20:00:28 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Simulink
---

Select a block ie gain in Simulink then in Matlab type:

    get(gcbh)

This shows the list of properties which can be controlled from Matlab. TO change one for example changing the gain paramter from double to a 10 bit fixed point number (`sfix10_en9`).

    set_param(gcbh, 'ParamDataTypeStr', 'fixdt(1,10,9)'); 

[From Matlab Central](http://www.mathworks.co.uk/matlabcentral/newsreader/view_thread/306640).
