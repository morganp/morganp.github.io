---
layout: post
title: "Verilog: Timeout"
date: 2014-06-14 08:08:26 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Verilog
published: true
---

To wait for a maximum of `10ns` for positive edge on clk then carry on with simulation.

    fork : wait_or_timeout
      begin
        #10ms;
        disable wait_or_timeout;
      end
      begin
        @(posedge clk);
        disable wait_or_timeout;
      end
    join

Often use to fail simulation if the expected signal does not occur,
this stops simulation hanging and allows status reports to be generated.

Originally posted as [SO answer](http://stackoverflow.com/a/12372233/97073).
