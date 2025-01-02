---
layout: post
title: "Ruby CLI user input using gets"
date: 2011-03-27 06:04:31 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Ruby
discuss_url: //95
url: //95/Ruby_CLI_user_input_using_gets
id: 95
---
Using a while true loop with 'gets' and a case statement, can create a compact command line interface for ruby scripts.

    while true
      puts "'q' to quit, 'c' to continue"
      command = gets
      case
        when command.match(/^q/) then
          puts "Quit"
          break
        when command.match(/^c/) then
          puts "Continue"
      end # case
    end # while true
