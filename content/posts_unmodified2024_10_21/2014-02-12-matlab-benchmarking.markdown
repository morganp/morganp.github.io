---
layout: post
title: "Matlab benchmarking"
date: 2014-02-12 20:55:42 +0000
comments: true
categories: Engineering
tags:
- Matlab
- Benchmark
---

In the following example we test the allocation speed of different types:

    samples_to_avg = 10000;
    for i=1:samples_to_avg
      tic; t = int8(zeros(32,2^16)); b(i) = toc;
    end
    avg_int8 = mean(b);
     
    for i=1:samples_to_avg
      tic; t = zeros(32,2^16); b(i) = toc;
    end
    avg_double = mean(b);
     
    %int 8 is
    disp(['int8 pre-allocation is ', num2str(1 - avg_double/avg_int8), ' times faster than doubles'])

