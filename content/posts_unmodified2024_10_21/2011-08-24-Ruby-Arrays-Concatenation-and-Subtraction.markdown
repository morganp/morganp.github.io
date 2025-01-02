---
layout: post
title: "Ruby Arrays Concatenation and Subtraction"
date: 2011-08-24 22:08:02 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //122
url: //122/Ruby_Arrays_Concatenation_and_Subtraction
id: 122
---
Building on my [original Ruby Arrays article][article1] a few more things you can do with Ruby Arrays.

Concatenation

    a = [1,2,3]
    b = [4,5,6]
    c = [a,b]
    > [[1,2,3],[4,5,6]]
    # Not quite what we wanted.
    c = [a,b].flatten
    > [1,2,3,4,5,6]

This can be achieved much simpler via addition

    a = [1,2,3]
    b = [4,5,6]
    c = a + b
    > [1,2,3,4,5,6]

Another cool fact that you can subtract array from each other. It will subtract objects which have matching object ids.

    a = [1,2,3]
    b = [4,5,6]
    c = a + b - [3,4]
    > [1,2,5,6]

This can also be used to list the unique methods of an object  by subtracting all base methods.

    fl = 0.0 # a float
    count_this = fl.methods.sort - Object.methods
    count_this.count
     => 52
    
     Object.methods.count
     => 102

     fl.methods.count
     => 127
     
[article1]: http://amaras-tech.co.uk/people/morgan/article/108
