---
layout: post
title: "Thor Variable Arguments"
date: 2014-04-01 19:39:19 +0100
comments: true
categories: Tech
tags:
- Ruby
- Command Line
---

[Thor][] is a Ruby Gem, which allows you to build command line applications which accept commands, in the same way `git` accepts `add` as a command.

The Helloworld example :

    require "thor"
    
    class MyCLI < Thor
      desc "hello NAME", "say hello to NAME"
      def hello(name)
        puts "Hello #{name}"
      end
    end
    MyCLI.start(ARGV)
    
The help and single input.  
    
    $ ruby thor_test.rb help hello
    > Usage:
    >  thor_test.rb hello NAME
    >
    > say hello to NAME

    
    $ ruby thor_test.rb Hello a
    > Hello a
    
Now with multiple, inputs: 
    
    $ ruby thor_test.rb Hello a b
    > thor_test.rb hello requires at least 1 argument: "thor_test.rb hello NAME”.
    
Not really what you want if you were building a command like `git add` when you
would want all following arguments as inputs.

To accept a variable number of arguments is not Thor specific but a standard 
ruby idiom. A splat in front of your variable ie `*name`.
      
    require "thor"
    
    class MyCLI < Thor
      desc "hello NAME", "say hello to NAME"
      def hello(*name)
        puts "Hello #{name * “ "}"
      end
    end
    MyCLI.start(ARGV)

    $ ruby thor_test.rb Hello a b
    > Hello a b


[Thor]: http://whatisthor.com/
