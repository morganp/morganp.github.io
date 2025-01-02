---
layout: post
title: "Matlab Wrapper Scripts"
date: 2014-03-17 19:48:57 +0000
comments: true
categories: Engineering
tags:
- Matlab
- Programming
---

To wrap a function with variable input arguments and pass them all on to the wrapped function.
Based on a [StackOverflow answer](http://stackoverflow.com/questions/4895556/how-to-wrap-a-function-using-varargin-and-varargout):

    function varargout = wrapper( varargin )
    [varargout{1:nargout}] = someFunction( varargin{:} ); 

Used in the [printf toolbox][]: where we wrap fprint to print directly to stdout.

    function printf( varargin )
      fprintf(1, varargin{:}); 
    end

[printf toolbox]: https://github.com/Matlab-Toolbox/printf
