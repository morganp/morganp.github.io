---
layout: post
title: "Verilog: Calculate primes"
date: 2014-12-20 07:28:41 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Math
- Verilog
---

Based on my answer to [this SO Question](http://stackoverflow.com/q/27461173/97073).

**[Definition of Prime](http://www.mathsisfun.com/definitions/prime-number.html):**

> A Prime Number can be divided evenly only by 1, or itself. 
And it must be a whole number greater than 1.

A simple method would be to iterate over numbers 2 to N, checking if it was divisible by all natural numbers greater than 2, and below the current value.

Once checked that it is not divisible by 2 there is not point checking for 4, 6, 8 etc. 
Remembering the definition of prime all numbers that are not prime are integer multiples of prime. so we have reduced the amount of work involved in testing primality.

    parameter        N        = 1000;          
    reg       [31:0] prime_number [0:N-1]; Store 0 to N prime numbers
    integer          test     ; // Result of primality test
    integer          k        ; // Currently looking for k'th prime 
    integer          index    ; // Counts 1 to k, indexing previous primes 
    integer          number_ut; // Number Under test

    reg        [1:0] state   ; 
    localparam       S_INC   = 2'b01;
    localparam       S_CHECK = 2'b10;

    initial begin
      prime_number[0] = 'd2; //Preload first Prime
      state           = S_CHECK; //Check set count first
      number_ut       = 'd3; // Number Under Test
      k               = 'd1; // Position 0 preloaded
      index           = 'd0;
      test            = 'd1;
    end

    always @(posedge clk ) begin
      if (state == S_INC) begin
        number_ut <= number_ut+1 ;
        state     <= S_CHECK ;
        index     <= 'd0;
        test      <= 'd1; // Safe default
      end
      else if (state == S_CHECK) begin
        if (test == 0) begin
          // Failed Prime test (exact divisor found)
          $display("Reject %3d", number_ut);
          state           <= S_INC ;
        end
        else if (index == k) begin
          //Passed Prime check
          //Use k+1 so that 2 is number 1, 3 is 2nd etc
          $display("Found the %1d th Prime, it is %1d", k+1, number_ut);
          prime_number[k] <= number_ut;
          k               <= k + 1;
          state           <= S_INC ;
        end
        else begin
          test  <= number_ut % prime_number[index] ;
          index <= index + 1;          
        end
      end
    end

[Example on EDA Playground](http://www.edaplayground.com/x/BzX).

This is however just a programming exercise as the resulting hardware is likely substantially bigger than just implementing a look up table to the maxim number of primes you can fit in `prime_number`. The look up table will also be ready from time zero and not need to recompute every time you power up.
