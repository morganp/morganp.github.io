---
layout: post
title: "gem permissions on WebFaction"
date: 2011-02-12 14:10:56 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Gem
- Programming
- Ruby
- WebFaction
discuss_url: //89
url: //89/gem_permissions_on_WebFaction
id: 89
---
After making a few updates to my site I decided to upgrade the version of sinatra I was using in my web faction account. for some reason I started getting these errors:

    $ gem update sinatra
    Updating installed gems
    Updating sinatra
    ERROR:  While executing gem ... (Gem::FilePermissionError)
        You don't have write permissions into the /usr/local/ruby1.8.7ee/lib/ruby/gems/1.8 directory.

This error was resolved by adding this line to my ~/.gemrc file (create it if it does not exist)

     gemhome: /home/webfaction-username/.gem/ruby/1.8

The results of gem env before and after fix:

    $ ./gem env
    RubyGems Environment:
      - RUBYGEMS VERSION: 1.3.7
      - RUBY VERSION: 1.8.7 (2009-12-24 patchlevel 248) [i686-linux]
      - INSTALLATION DIRECTORY: /usr/local/ruby1.8.7ee/lib/ruby/gems/1.8
      - RUBY EXECUTABLE: /usr/local/ruby1.8.7ee/bin/ruby
      - EXECUTABLE DIRECTORY: /usr/local/ruby1.8.7ee/bin
      - RUBYGEMS PLATFORMS:
        - ruby
        - x86-linux
      - GEM PATHS:
         - /usr/local/ruby1.8.7ee/lib/ruby/gems/1.8
         - /home/webfaction-user/.gem/ruby/1.8
      - GEM CONFIGURATION:
         - :update_sources => true
         - :verbose => true
         - :benchmark => false
         - :backtrace => false
         - :bulk_threshold => 1000
         - :sources => ["http://rubygems.org", "http://gems.github.com"]
         - "gem" => "--no-ri --no-rdoc"
      - REMOTE SOURCES:
         - http://rubygems.org
         - http://gems.github.com

After fix

    $ ~/webapps/passenger/gems/bin/gem env
    RubyGems Environment:
      - RUBYGEMS VERSION: 1.3.7
      - RUBY VERSION: 1.8.7 (2009-12-24 patchlevel 248) [i686-linux]
      - INSTALLATION DIRECTORY: /home/webfaction-user/.gem/ruby/1.8
      - RUBY EXECUTABLE: /usr/local/ruby1.8.7ee/bin/ruby
      - EXECUTABLE DIRECTORY: /home/webfaction-user/.gem/ruby/1.8/bin
      - RUBYGEMS PLATFORMS:
        - ruby
        - x86-linux
      - GEM PATHS:
         - /home/webfaction-user/.gem/ruby/1.8
         - /usr/local/ruby1.8.7ee/lib/ruby/gems/1.8
      - GEM CONFIGURATION:
         - :update_sources => true
         - :verbose => true
         - :benchmark => false
         - :backtrace => false
         - :bulk_threshold => 1000
         - :sources => ["http://rubygems.org", "http://gems.github.com"]
         - "gem" => "--no-ri --no-rdoc"
         - "gemhome" => "/home/webfaction-user/.gem/ruby/1.8"
      - REMOTE SOURCES:
         - http://rubygems.org
         - http://gems.github.com

 
