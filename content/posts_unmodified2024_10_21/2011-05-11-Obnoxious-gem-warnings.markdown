---
layout: post
title: "Obnoxious gem warnings"
date: 2011-05-11 17:11:47 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Gem
- Programming
- Ruby
discuss_url: //106
url: //106/Obnoxious_gem_warnings
id: 106
---
recenlty after updating rubygems Istarted getting a lot of warning like this when running ruby or executable gems:

NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299@global/specifications/rake-0.8.7.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/bundler-1.0.12.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/bundler-1.0.7.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/heroku-1.12.0.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/heroku-2.0.4.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/httparty-0.5.2.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/httparty-0.7.7.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/json-1.4.6.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01.
Gem::Specification#default_executable= called from /Users/morgy/.rvm/gems/ruby-1.8.7-p299/specifications/json-1.5.1.gemspec:10.
NOTE: Gem::Specification#default_executable= is deprecated with no replacement. It will be removed on or after 2011-10-01. 

Using RVM the fix is to run
---------------------------

     rvm rubygems current
