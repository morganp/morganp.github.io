---
layout: post
title: "Minify your HTML from Sinatra"
date: 2012-04-26 15:13:49 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Performance
- Programming
- Ruby
- Sinatra
- Web
discuss_url: //155
url: //155/Minify_your_HTML_from_Sinatra
id: 155
---
There are gzip compression options available but when I looked at this a long time ago I found that the extra server load to compress (with out caching) and the extra delay in the browser to decompress was not worth the few bytes it saved and lead to longer times before seeing the fully rendered page.

Minification or minifying is more about removing white space, in the case of javascript it can also optimise variable names. For html we would not want to do that unless our css was going to be converted to match exactly. 

After a little digging and trying a few gems which failed to set there dependancies correctly and even `required 'pp'`\*, I found TidyFFI.

* Really useful for debugging but I do not think has a place in deployed code.

Minify HTML
==

    gem install TidyFFI

Before:

    get '/' do
      erb :'about'
    end 

After :

    require 'tidy_ffi'
    get '/' do
      TidyFFI::Tidy.new( erb :'about' ).clean 
    end 
