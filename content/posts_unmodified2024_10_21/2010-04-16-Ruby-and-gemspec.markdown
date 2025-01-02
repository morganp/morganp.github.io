---
layout: post
title: "Ruby and gemspec"
date: 2010-04-16 10:01:58 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Gem
discuss_url: //16
url: //16/Ruby_and_gemspec
id: 16
---
I have just forked and cloned a project on github and discovered \*.gemspec files. They are a nice way of specifying the gem dependencies in your project. once you have the copied/cloned a project before you run it just call:
  
    $ gem build something.gemspec

The [gemspec documentation][gemspec].

[gemspec]: http://docs.rubygems.org/read/chapter/20
