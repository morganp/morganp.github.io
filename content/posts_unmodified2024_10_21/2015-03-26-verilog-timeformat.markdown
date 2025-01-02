---
layout: post
title: "Verilog Timeformat"
date: 2015-03-26 19:21:25 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Verilog
---

Time can be displayed during simulation using `%t`.

    $display("%t", $realtime);
 
Timeformat is used to control the way (`%t`) this is displayed:

    //$timeformat(unit#, prec#, "unit", minwidth);
    $timeformat(-3, 2, " ms", 10); // -3 and " ms" give useful display msg
 
1. unit is the base that time is to be displayed in, from 0 to -15
2. precision is the number of decimal points to display.
3. "unit" is a string appended to the time, such as " ns".
4. minwidth is the minimum number of characters that will be displayed.
 
      0 = 1 sec
     -1 = 100 ms
     -2 = 10 ms
     -3 = 1 ms
     -4 = 100 us
     -5 = 10 us
     -6 = 1 us
     -7 = 100 ns
     -8 = 10 ns
     -9 = 1 ns
    -10 = 100 ps
    -11 = 10 ps
    -12 = 1 ps
    -13 = 100 fs
    -14 = 10 fs
    -15 = 1 fs
