---
layout: post
title: "Matlab sort_by"
date: 2014-03-17 18:55:11 +0000
comments: true
categories: Engineering
tags:
- Matlab
---

In ruby we can perform schwartzian transforms easily with the sort_by method. This allows sorting enumerators by any property.

For example to do a non case sensitive sort:

    some_array.sort_by { |x| x.downcase }

[Based on this Mathworks blog][], I have ported the [Matlab central code][] to a [Toolbox on Github][]. 

After Downloading the toolbox and adding the functions folder to your path.

    addpath('../lib/nested_sort/function/');


Basic usage is:


    A = struct('name', num2cell(1:4), 'value', {5,2,3,1});
    B=sortStruct(A,'value');

B is A sorted by 'value'.

[Based on this Mathworks blog]: http://blogs.mathworks.com/pick/2010/09/17/sorting-structure-arrays-based-on-fields/
[Matlab central code]: http://www.mathworks.com/matlabcentral/fileexchange/28573-nested-sort-of-structure-arrays
[Toolbox on Github]: https://github.com/Matlab-Toolbox/nested_sort

