---
layout: post
title: "SystemVerilog: RTL Types"
date: 2015-03-26 20:08:34 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Verilog
- Programming
---
`reg` and `wire` were the original synthesisable types. Wires are constantly assigned and regs are evaluated at particular points, the advantage here is for the simulator to make optimisations.

    wire w_data;
    assign w_data = y;

    // Same function as above using reg
    reg r_data;
    always @* 
      r_data = y ;


A common mistake when learning Verilog is to assume the reg type implies a register in hardware. The earlier optimisation for the simulator can be done through the context of its usage.

This introduces `logic` which can be used in place of wire and reg.

    logic  w_data;
    assign w_data = y;

    // Same function as above using reg
    logic r_data;
    always @* 
      r_data = y ;

The type `bit` and `byte` have also been created that can only hold 2 states 0 or 1 no x or z. `byte` implies `bit [7:0]`. Using these types offers a small speed improvement but I would recommend not using them in RTL as your verification may miss uninitialized values or critical resets.

The usage of `bit` and `byte` would be more common in testbench components, but can lead to issues in case of having to drive x's to stimulate data corruption and recovery.

----

**Update**

At the time of writing I was under the impression that `logic` could not be used for tristate, I am unable to find the original paper that I based this on. Until further updates, comments or edits, I revoke my assertion that *logic can not be used to create tri-state lines*.

----

The `tri` type has been added, for explicitly defining a tri-state line. It is based on the properties of a `wire`, `logic` is based on the properties of a `reg`.

    tri t_data;
    assign t_data = (drive) ? y : 1'bz ;

If you no longer have to support backwards compatibility Verilog then I would recommend switching to using `logic` and `tri`. Using `logic` aids re-factoring and and `tri`  reflects the design intent of a tristate line.

Originally posted as a[ SO answer](http://stackoverflow.com/a/13285242/97073).

