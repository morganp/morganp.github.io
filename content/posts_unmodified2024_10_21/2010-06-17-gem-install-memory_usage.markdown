---
layout: post
title: "gem install memory_usage"
date: 2010-06-17 13:01:14 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Gem
- Memory
- OS X
- Performance
- Programming
- Ruby
discuss_url: //42
url: //42/gem_install_memory_usage
id: 42
---
Just released my first gem ['memory_usage'][gem] Version 0.0.1.

    $ gem install memory_usage

Assuming the gems folder has been set-up on your path just call

    $ memory_usage

Which will work as a stand alone application to report memory usage, but can also be used a Object for taking snap shots during runtime.

The TODO list:
* Create a github page/site for the project
* report should return an object which can be saved for comparison over time
* Add program filter, so can report just for 1 application

[gem]: http://rubygems.org/gems/memory_usage
