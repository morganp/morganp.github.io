---
layout: post
title: "Verilog: define if not defined"
date: 2015-03-26 19:45:10 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Verilog
---

To set a default define option while allowing it to be overridden from the command line.

    `ifndef mode_sel
      `define mode_sel 0
    `endif

The command line should override testbench defined options but this has proven unreliable.

command line to set value:

    irun -define mode_sel=1 ...
