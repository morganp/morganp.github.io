---
layout: post
title: "Beyond the LSB"
date: 2014-03-13 19:07:42 +0000
comments: true
categories: Engineering
tags:
- LFSR
- Random
---

If we truncate a number, that is to throw away the LSBs (least significant bits) we loose resolution.

A 4 bit number truncated to 2 bits: *numbers shown in binary (Base2).*   

    0100
    0101
    0110
    0111 

Would all become 01.

Introducing Dither
==

Effective dithering increase the accuracy beyond the LSB of the truncated values. 
Consider a small fractional value rounded to an integer. Starting with 0.5 with 1 bit random dither:

    Input  Dither Sum & truncate
    00.1   0.1    01
    00.1   0.0    00
    00.1   0.1    01
    00.1   0.0    00
    Average over 4 samples is 0.5

If the value is below 0.5 this dither scheme will not work, as it would never
round to a full integer.

So we increase the dither to 2 bits. Inputting a constant 0.25, Dither cycling
through all possible values

    Input  Dither Sum & truncate
    00.01  0.00   00
    00.01  0.01   00
    00.01  0.10   00
    00.01  0.11   01
    Average of 4 Samples 0.25

In the above example we have increased the resolution of the time averaged value
by 2 bits.

For every doubling of the frequency we gain an effective LSB if dithered correctly.
Adding more bits than `log2(oversampling rate)` of dithering will not gain accuracy.
Although it may help breakup tonal behaviour of a system.

Summary
--

Apply dither to the bits to be truncated. Apply enough bits of dither so it is
possible for the LSB of the required resolution to effect the truncated value.

The increase in resolution is limited to `log2(oversampling rate)`.

**Further Reading:**

[Quanatization and Dither: A Theoretical Survey. LIPSHITZ, WANNAMAKER and VANDERKOOY][1]  

[Resolution Below the Least Significant Bit in Digital Systems with Dither. VANDERKOOY and LIPSHITZ][2]

[1]: http://www.ece.rochester.edu/courses/ECE472/resources/Papers/Lipshitz_1992.pdf

[2]: http://drewdaniels.com/dither.pdf
