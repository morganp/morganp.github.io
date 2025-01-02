---
layout: post
title: "SystemVerilog: Constrained Random"
date: 2015-02-18 17:01:56 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Verilog
- SystemVerilog
- Verification
- Programming
---

A minimal example of constrained random to constraining a 4 bit value to 0 to 11 when randomised.

    module tb;

      class cr_example_t
        rand bit val;
        rand bit [3:0] sel;

        constrain c1 {
          sel < 12;
        }
      endclass

      cr_example_t cr_example = new;

      initial begin :test_program
        cr_example.randomise();
        $display(cr_example.val);
        $display(cr_example.sel);

        $finish;
      end

    endmodule
