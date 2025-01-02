---
layout: post
title: "Ruby run (execute) command line"
date: 2010-03-30T14:50:00+00:00 
comments: true
sharing: true
footer: true
categories: Tech
tags:
discuss_url: //5
url: //5/Ruby_run_%28execute%29_command_line
id: 5
---
Also a [gist][gist] on github. This code snippet is an example of how to execute a command line argument in ruby and display the output

    #!/usr/bin/env ruby
    do_and_report("ls")

    #Small function to run a command and output return values
    def do_and_report(command)
       f = open("| #{command}")
       g = Array.new
       while (foo = f.gets)
          g << foo
       end
       g.each do |element|
          puts element
       end
    end



[gist]: http://gist.github.com/341670
