---
layout: post
title: "Ruby Print Array"
date: 2014-04-01 18:36:00 +0100
comments: true
categories: Tech
tags:
- Ruby
---

`puts` and `to_s` could be better:

    a = [1, 2, 3]
    puts a
    > 1
    > 2
    > 3

    puts a.to_s
    > [1, 2, 3]

Nicely print an array
--

Multiply it out with spaces:

    a = [1, 2, 3]
    puts a * " "
    > 1 2 3
