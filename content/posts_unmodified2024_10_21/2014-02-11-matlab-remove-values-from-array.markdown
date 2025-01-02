---
layout: post
title: "Matlab remove values from array"
date: 2014-02-11 21:21:44 +0000
comments: true
categories: Engineering
tags:
 - Matlab
---


Remove all values of 3 from array

    a = [1 2 3 4 3];
    a(any(a==3,1)) = []
    a =
         1     2     4

Remove 2 or less from array

    a = [1 2 3 4 3];
    a(any(a<=2,1)) = []
    a =
         3     4     3

Remove values between 2 and 3

    a = [1 2 3 4 3];
    a(any((a>=2)&(a<=3),1)) = []
    a =
         1     4

Based on [examples from matlabnewbie][source].

Remove values (`12 & 13`) based on a set (array):

    a = 11:20;
    a = setdiff(a,[12,13])
    a = 
        11    14    15    16    17    18    19    20
   

[source]:  http://matlabnewbie.blogspot.co.uk/2011/11/remove-any-rows-that-contains-specific.html
