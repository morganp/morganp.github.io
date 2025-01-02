---
layout: post
title: "Object-Oriented Matlab"
date: 2014-02-28 19:58:53 +0000
comments: true
categories: Engineering
tags:
- Matlab
---
[Mathworks Article on Object-Oriented programming for Matlab](http://www.mathworks.co.uk/help/matlab/matlab_oop/using-objects-to-write-data-to-a-file.html).

A quick example of the syntax:


    classdef sads
      properties
        Name
        SampleRate
      end
      properties (Dependent)
        Frequency
      end
      methods
        %% Next function is the constructor
        function  obj=sads(Name, SampleRate)
      end
    end

Similar to structures but can not arbitrarily add new fields by assigning values to them.

[Mathworks top level, introduction to OO programming for matlab](http://www.mathworks.co.uk/discovery/object-oriented-programming.html).
[Links to other Mathworks OO articles](http://www.mathworks.co.uk/help/matlab/object-oriented-programming.html). 
