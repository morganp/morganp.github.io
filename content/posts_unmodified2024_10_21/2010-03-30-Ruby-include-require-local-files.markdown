---
layout: post
title: "Ruby include (require) local files"
date: 2010-03-30T14:50:00+00:00 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //2
url: //2/Ruby_include_%28require%29_local_files
id: 2
---
Also a [gist][ruby_example] on github. This is an example of how you can require files in a relative path to the script. As Ruby scripts execute from which ever path they were called.
    #!/usr/bin/env ruby
 
    #A way of including local functions in sub folders 
    path = File.expand_path $0
    path = File.dirname(path)
 
    require "#{path}/SubDir/function_1.rb"
    require "#{path}/SubDir/function_2.rb"
    require "#{path}/SubDir/function_3.rb"
 
    #or change working dir of script
    Dir.chdir(path) 


[ruby_example]: http://gist.github.com/341255
