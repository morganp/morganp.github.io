---
layout: post
title: "Matlab: floating point checking equality"
date: 2015-06-10 20:43:32 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Maths
- Matlab
published: false
---

As previously decribed [floating point arithmetic is not associative][assoc]. Which means it is very easy for floating point models not to match even though they are performing the same arithmetic operations. In matlab we compare the results:

    a = 0.1 + 0.2 + 0.3 ;
    b = 0.1 + (0.2 + 0.3);

    isequal(a, b)
    > 0

a & b are not equal, they are a least significant bit out, when comparing floating point numbers it is common to allow this amount of tolerance. Matlab anonymous functions can be used to create a new `isequal` function which takes a tolerance value. Idea from [Stackoverflow][].

 
    isequalAbs = @(x,y,tol) ( all(abs(x-y) <= tol ));
    floating_point_tol = 1e-15;
     
    isequalAbs(a, b, floating_point_tol)

[assoc]: /blog/engineering/floating-point-arithmetic-is-not-associative/
[Stackoverflow]: http://stackoverflow.com/questions/2202641/how-do-i-compare-all-elements-of-two-arrays
