---
layout: post
title: "Matlab repeat a matrix n times"
date: 2013-11-27 10:57:36 +0000 
comments: true
sharing: true
footer: true
categories: Engineering
tags:
- Matlab
discuss_url: //241
url: //241/Matlab_repeat_a_matrix_n_times
id: 241
---
repmat(matrix, [repeat_y, repeat_x])

Horizontal

    repmat([1 2 3],[1,4])
    
    ans =
 
         1     2     3     1     2     3     1     2     3     1     2     3

Vertical

    repmat([1; 2; 3],[4,1])
    
    ans =
    
         1
         2
         3
         1
         2
         3
         1
         2
         3
         1
         2
         3
