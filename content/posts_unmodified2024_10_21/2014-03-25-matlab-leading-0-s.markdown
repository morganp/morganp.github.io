---
layout: post
title: "Matlab: leading 0's"
date: 2014-03-25 20:52:35 +0000
comments: true
categories: Engineering
tags:
- Matlab
- Programming
---

For adding leading zeros to a number the following can be used for 4 decimal places with integer input:

    dat = 1;
    sprintf(['%4.4d'], dat)

To make this programmable the following can be used:

    dat       = 1;
    min_width = 4;
    sprintf(['%',num2str(min_width),'.', num2str(min_width),'d'], 1)

For string inputs you need:

    dat       = '1'
    min_width = 4;
    sprintf(['%0',num2str(6),'s'], dat)
