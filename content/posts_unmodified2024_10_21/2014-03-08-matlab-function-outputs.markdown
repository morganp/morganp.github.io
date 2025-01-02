---
layout: post
title: "Matlab Function Outputs"
date: 2014-03-08 08:02:27 +0000
comments: true
categories: Engineering
tags:
- Matlab
- Programming
---

Handling functions with extraneous leading outputs. For example:
 
    function [a,b] = dummy_function
      a = 10;
      b = 20;
    endfunction


    [a, b] = dummy_function
    
    a =
        10
    
    b =
        20

If `a` is not required it can be replaced with a tilda `~`.

    [~, b] = dummy_function
    
    b =
        20
