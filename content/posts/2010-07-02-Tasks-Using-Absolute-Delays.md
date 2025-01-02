---
layout: post
title: Tasks Using Absolute Delays
date: 2010-07-02 00:10:10 +0000
comments: true
category: Engineering
tags: Verification, Verilog, SystemVerilog
---

As previously mentioned SystemVerilog introduced abolute delays in the form of `#1s;`, `#1ms`, `#1us`, `#1ns`.
Using these as values passed into function requires declaring the input to be of type time.

    task arduous_delay( time delay );
      begin
        #delay;
      end
    endtask

    //Usage
    arduous_delay( 1ms );
