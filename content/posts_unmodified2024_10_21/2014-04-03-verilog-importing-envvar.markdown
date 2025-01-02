---
layout: post
title: "Verilog importing envvar"
date: 2014-04-03 18:22:00 +0100
comments: true
categories: 
- Engineering
tags:
- Verilog
- Programming
comments: true
sharing: true
footer: true
---

Based on a [Stackoverflow answer](http://stackoverflow.com/a/15103561/97073), to import environment variables into Verilog you can use:

    import "DPI-C" function string getenv(input string env_name);

    module top;
      initial begin
        $write("env = %s\n", {getenv("HOME"), "/FileName"});
      end
    endmodule
