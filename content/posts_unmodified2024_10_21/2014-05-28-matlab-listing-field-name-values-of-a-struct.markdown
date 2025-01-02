---
layout: post
title: "Matlab: Listing field name values of a struct"
date: 2014-05-28 19:05:01 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Matlab
published: true
---


    s = struct ;
    s(1).dat =‘a' ;
    s(1).freq=11 ;
    s(2).dat =‘b' ;
    s(2).freq=22 ;

Where:

    s(1)

    ans =

         dat: 'a'
        freq: 11

How do you access [‘a’, ‘b’] and [11, 22]?

    [s.dat] , [s.freq]

The `[]` are really important here.

    [s.freq]

    ans =

        11    22

[Solution found on a Loren Post](http://blogs.mathworks.com/loren/2007/04/19/vectorizing-access-to-an-array-of-structures/).

