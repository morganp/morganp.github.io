---
layout: post
title: "warning: already initialized constant"
date: 2011-10-06 00:57:30 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Ruby
discuss_url: //123
url: //123/warning%3A_already_initialized_constant
id: 123
---
Do you some times see:

    FileUtils.rb:93: warning: already initialized constant OPT_TABLE
    FileUtils.rb:1176: warning: already initialized constant S_IF_DOOR
    FileUtils.rb:1406: warning: already initialized constant DIRECTORY_TERM
    FileUtils.rb:1408: warning: already initialized constant SYSCASE
    FileUtils.rb:1527: warning: already initialized constant LOW_METHODS
    FileUtils.rb:1533: warning: already initialized constant METHODS

After quite some searching I discovered the cause of these errors. require is clever it only allows you to require each file once.

    ruby-1.9.2-p290 :001 > require 'fileutils'
     => true 
    ruby-1.9.2-p290 :002 > require 'fileutils'
     => false 

However it is not case sensitive.

    ruby-1.9.2-p290 :003 > require 'FileUtils'
    .... 
    => true 

So if you accidentally include FileUtils this is the same as reopening the module and re-declaring the constants a second time. you should always require the lowercase version. you can [include the camelcase][ref] version for mixins. 

If you are getting this during development of a program you could do something like :

    grep -Rn "require 'FileUtils'" ~/Code

Incase the error seems to be coming from a file other than fileutils.rb it is likely that tehre is a camelcase version of it being included somewhere, try searching for it be modifying the above command.

[ref]: http://www.ruby-forum.com/topic/123026
