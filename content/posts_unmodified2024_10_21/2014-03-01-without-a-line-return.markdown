---
layout: post
title: "$display without a line return"
date: 2014-03-01 17:49:43 +0000
comments: true
categories: Engineering
tags: 
- Verilog
- Programming
---

In Verilog to output to stdout without a line return use `$write();`

Equivalent statements :

    $write("\n");
    $display("");


