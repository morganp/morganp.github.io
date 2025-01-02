---
layout: post
title: "Get latest Ruby 1.9.2 build with RVM"
date: 2011-07-16 07:47:23 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Gem
- Ruby
- RVM
discuss_url: //118
url: //118/Get_latest_Ruby_1.9.2_build_with_RVM
id: 118
---
Ruby 1.9.2-p290 released, if you have [RVM][] installed updating to the latest release is easy

    rvm get head
    rvm reload
    rvm install 1.9.2

If you do not have [RVM][] installed you can [read up here][install] or just run:

    bash < <(curl -s https://rvm.beginrescueend.com/install/rvm)

You may want to check your default gem list in your old version and add then make the new ruby your default. Having bundler present is almost essential for most projects, to install the protected gemsets.

    rvm gem list > rvm_old_gemlist.txt
    rvm --default use 1.9.2
    gem install bundler

When only specifying a ruby version the latest release will be the default.

[RVM]: http://beginrescueend.com/
[install]: http://beginrescueend.com/rvm/install/    
