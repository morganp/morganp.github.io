---
layout: post
title: "Bash String Manipulation"
date: 2014-03-05 21:32:14 +0000
comments: true
categories: Tech
tags:
- Command Line
- bash
---
Removal of substring:

    string="test string"
    echo $string

    remove="test"
    short_string=${string#$remove}
    echo short_string

Note that inside the `${}` `string` does not have a `$`, it is implied.
The second half `$remove` does require it. 

[More info](http://tldp.org/LDP/abs/html/string-manipulation.html).

