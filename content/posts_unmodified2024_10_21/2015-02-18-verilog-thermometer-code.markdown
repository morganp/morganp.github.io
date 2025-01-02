---
layout: post
title: "Verilog: Thermometer Code"
date: 2015-02-18 16:51:43 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Verilog
- Programming
---

Efficiently create a [thermometer code][wiki] in verilog:

    localparam M = 32;

    function [M-1:0] therm_code;
      input    [$clog2(M):0] val;
      begin
        for (int i = 0; i<M; i++) begin
          therm_code[i] = (i<val);
        end
      end
    endfunction

Other methods which do not synthesis as well:

    therm_code  = (2**val) - 1;

    therm_code = ~({M{1'b1}} << val);


[wiki]: http://en.wikipedia.org/wiki/Unary_coding
