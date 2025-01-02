---
layout: post
title: "Super simple Ruby list directory contents"
date: 2010-05-16 08:14:52 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //33
url: //33/Super_simple_Ruby_list_directory_contents
id: 33
---
A very simple Ruby way for listing files in a directory is the glob function:

    #!/usr/bin/env ruby
    
    @directory_to_list = '/some/path/'
    files = Dir.glob(@directory_to_list + '*')
    
    files.each do |x|
       puts x
    end

To avoid the separate each block, select could be used to iterate over the results. Used below with entries instead of glob.

    Dir.entries(@directory_to_list).select do |f| 
      puts f
    end

NB Dir.glob takes a pattern as an argument, Dir.entries takes a path.
