---
layout: post
title: "Matlab: Array content check"
date: 2014-05-07 18:13:24 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Matlab
---

Checking if an Array contains a number:

    input = [1,2,3,4];
    check = 4;
    any(input==4)

Check if a number is contained in an array:

    input = 32;
    check = [32,64,128];
    any( check==input )
