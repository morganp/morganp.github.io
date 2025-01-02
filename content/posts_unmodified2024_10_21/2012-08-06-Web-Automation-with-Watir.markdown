---
layout: post
title: "Web Automation with Watir"
date: 2012-08-06 13:30:06 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Gem
- OS X
- Programming
- Ruby
- Web
discuss_url: //177
url: //177/Web_Automation_with_Watir
id: 177
---
[Watir][] is a web testing framework implemented in ruby, but can be used for testing or automating any web service.

    gem install watir-webdriver
    #or in your Gemfile
    gem "watir-webdriver"

For Internet Explorer on Windows
--

    require 'watir'
    browser = Watir::Browser.new :ie

Firefox or Chrome
--
 
    require 'watir-webdriver'
    browser = Watir::Browser.new :firefox
    # OR
    browser = Watir::Browser.new :chrome

For OS X and Automating chrome I had to install the chrome driver from [chromedriver][] or using [homebrew][].

    brew install chromedriver

A simple script might be:

    require 'watir-webdriver'
    browser = Watir::Browser.new :chrome
    browser = Watir::Browser.start 'www.google.com'
    puts browser.title
    browser.close

This launches a graphical browser and performs the actions requested.

Headless
==

There is a way to make these compatible with severs which do not have a graphics system, by installing the headless gem.


    gem install watir-webdriver
    gem install headless
    #or in your Gemfile
    gem "watir-webdriver"
    gem "healdess"

The headless gem uses xvfb to perform graphical actions. If you are not on headless machine these will still be visible.

    require 'watir-webdriver'
    require 'headless'
    
    headless = Headless.new
    headless.start
    
    browser = Watir::Browser.start 'www.google.com'
    puts browser.title
    browser.close
    
    headless.destroy


[chromedriver]: http://code.google.com/p/chromedriver/downloads/list
[homebrew]: http://mxcl.github.com/homebrew/ 
[Watir]: http://watir.com/
