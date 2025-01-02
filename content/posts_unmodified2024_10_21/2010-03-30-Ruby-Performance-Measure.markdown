---
layout: post
title: "Ruby Performance Measure"
date: 2010-03-30T14:50:00+00:00 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Matlab
- Performance
discuss_url: //6
url: //6/Ruby_Performance_Measure
id: 6
---
Also available as a [gist][gist]. Very simple way of measuring execution time in seconds using Ruby

    #!/usr/bin/env ruby
    # Measure performance in seconds of tasks
    # Record Startime For performance measurements
    startTime = Time.now
 
    #Main part of script goes here
 
    #Calculate and Display Execution Time in seconds
    execTime = Time.now - startTime
    puts "Execution time #{execTime} seconds."

Matlab has a slightly simpler function for this

    tic
    %Main part goes here
    toc


[gist]: http://gist.github.com/342639
