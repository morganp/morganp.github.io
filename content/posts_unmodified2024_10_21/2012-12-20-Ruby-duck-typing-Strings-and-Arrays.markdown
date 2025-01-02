---
layout: post
title: "Ruby duck typing Strings and Arrays"
date: 2012-12-20 16:12:08 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Programming
discuss_url: //207
url: //207/Ruby_duck_typing_Strings_and_Arrays
id: 207
---
How to get method which handles a single string input or an array of strings?

Splat \*
--

\* turns single strings into Arrays, leaves arrays alone.

    a = "hello"
    a = *a
    puts a.inspect
    =>  ["hello"]

    a = ["hello", "world"]
    a = *a
    puts a.inspect
    => ["hello", "world"]


Example Usage
--

    def unknown_input( input_data )
      input_data = *input_data
      input_data.each do |input_item|
          puts input_item
      end
    end

