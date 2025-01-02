---
layout: post
title: "Ruby runnable and includeable"
date: 2010-06-11 13:24:06 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //38
url: //38/Ruby_runnable_and_includeable
id: 38
---
I might have just made up includable, but I like it.

Some times you have written a ruby script (using classes) which does something awesome and it might be nice if other future scripts function could make use of this object class you have just created, while keeping the script in a runnable stand alone state.

This is quite trivial once you realise that $0 is the file that was called on the command line and \_\_FILE\_\_ is the current file.

Available as a [gist][].

    #!/usr/bin/env ruby
    
    class HelloWorld
       def initialize
          @msg = "HelloWorld!"
       end
    
       def to_s
          return @msg
       end
    end
    
    #Only execute if called directly
    #ie other file can require/include and this part will not be executed
    # $0 calling file (eneterd at command line)
    # __FILE__ This file
    
    if $0 == __FILE__
       hi_world = HelloWorld.new
       puts hi_world
    end

[gist]: http://gist.github.com/435161
