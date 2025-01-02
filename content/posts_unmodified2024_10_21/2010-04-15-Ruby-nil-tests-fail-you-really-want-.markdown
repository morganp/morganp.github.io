---
layout: post
title: "Ruby .nil? tests fail ? you really want ||="
date: 2010-04-15 07:43:50 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //15
url: //15/Ruby_.nil%3F_tests_fail_%3F_you_really_want_%7C%7C%3D
id: 15
---
I recently discovered ||= in ruby. Its main use is for initialising a variable if it does not already exists, this is great for extending templates with new functions and maintaining backwards compatibility.

    irb(main):001:0> x 
    NameError: undefined local variable or method `x' for main:Object
	from (irb):1
    irb(main):002:0> x ||= 0
    => 0
    irb(main):003:0> x = 10
    => 10
    irb(main):004:0> x ||= 0
    => 10

I previously used :

    if @x.nil? 
        @x = 10   
    end

which is 3 times as many lines of code and does not work with all variable types infact .nil? is only valid for global ($) and instance (@) variables.

    irb(main):001:0> $x.nil?
    => true
    irb(main):002:0> @x.nil?
    => true
    irb(main):003:0> @@x.nil?
    NameError: uninitialized class variable @@x in Object
       from (irb):3
    irb(main):004:0> x.nil?
    NameError: undefined local variable or method `x' for main:Object
       from (irb):4

