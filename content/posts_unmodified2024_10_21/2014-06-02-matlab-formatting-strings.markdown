---
layout: post
title: "Matlab: Formatting Strings"
date: 2014-06-02 18:46:09 +0100
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

The official documentation can be found on [mathworks][Matlab Strings].

To display a number with 3 Integer decimal places and 3 fraction places 
`$f7.3` 7 rather than 6 as need place for the decimal point.


    >> a = sprintf('6.3-%6.3f-', 123.678)
    a =
    6.3-123.678-
  
    >> a = sprintf('6.3-%6.3f-', 23.678)
    a =
    6.3-23.678-
  
    >> a = sprintf('6.3-%6.3f-', 3.678)
    a =
    6.3- 3.678-

-ve numbers
--
If signed you need to leave space for -ve `$f8.3` :


    >> a = sprintf('7.3-%7.3f-', -123.678)
    a =
    7.3--123.678-
  
    >> a = sprintf('7.3-%7.3f-', -23.678)
    a =
    7.3--23.678-
  
    >> a = sprintf('8.3-%8.3f-', -23.678)
    a =
    8.3- -23.678-

For reliable and consistent floating point displays use:

    %(fractional places + integer places + 2).(fractional places)f


[Matlab Strings]: http://www.mathworks.co.uk/help/matlab/matlab_prog/formatting-strings.html#bq0z8vc-6

