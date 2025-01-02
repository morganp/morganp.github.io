---
layout: post
title: "Matlab: Split Odd &amp; Even Array Elements"
date: 2014-05-07 17:58:33 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Matlab
- Programming
---
Using Matlab to splitting data into odd and even samples.

A for loop approach:

    data_odd  = [];
    data_even = [];
    for i = 1:length(data)
      if mod(i,2)
        %% disp('odd')
        data_odd = [data_odd, data(i)]
      else
        %% disp('even')
        data_even = [data_even, data(i)]
      end
    end

Matlab approach using ranges to remap values:

    data_odd =data(1:2:end);
    data_even=data(2:2:end);

Ranges are composed of `start_index:step_size:end_index`. If step_size is omitted, 1 is assumed.

`end` has a special meaning when used inside an array, it is the position of the last element.
To append to an array you could use `data(end+1) = append_value`

No error or warning is triggered if the `end_index` can not be reached with the given step size, which is why this works with `end` as the stop point of both sides.

Example
--

    a   = [1, 2, 3, 4, 5];
    odd = a(1:2:end)
    even= a(2:2:end)

    odd =
         1     3     5

    even =
         2     4
