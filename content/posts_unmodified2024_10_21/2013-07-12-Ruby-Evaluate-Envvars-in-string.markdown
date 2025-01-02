---
layout: post
title: "Ruby Evaluate Envvars in string."
date: 2013-07-12 22:59:37 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Programming
discuss_url: //228
url: //228/Ruby_Evaluate_Envvars_in_string.
id: 228
---
In ruby Dir.entries takes a path and returns a list of its contents. However it does not deal with paths (strings) which contain Enviroment Variables (envvars), first they need to be expanded.
 

Given:SHELL:

    export DIR=x
    export FILE=y.z

Ruby string:

    s = "$DIR/test/$FILE"
    puts s
    => "$DIR/test/$FILE"

    def expand_envvars( in_string )
      return in_string.gsub(/\$(\w+)/) { ENV[$1] }
    end

    puts expand_envvars( s )
    => "x/test/y.z"
  
Based on: [http://www.ruby-forum.com/topic/180340](http://www.ruby-forum.com/topic/180340)
