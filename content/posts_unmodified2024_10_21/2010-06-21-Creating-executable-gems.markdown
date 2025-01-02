---
layout: post
title: "Creating executable gems"
date: 2010-06-21 08:43:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Gem
- Programming
- Ruby
discuss_url: //43
url: //43/Creating_executable_gems
id: 43
---
This is not necessarily the correct way of creating executable gems but a method which worked for me.

Assuming we are working in folder just for this gem we need a structure like this:
 
    my_gem/
       my_gem.gemspec
       bin/
          my_gem #<-script with no file extension
       lib/
          my_gem.rb #<- Actual class file

my_gem.gemspec

    require 'rake/gempackagetask'
    spec = Gem::Specification.new do |s|
       s.name         = 'my_gem'
       s.version      = '0.0.1'
       s.platform     = Gem::Platform::RUBY
       s.summary      = 'Report memory usage on Mac OS X, Linux and Unix.'
       s.homepage     = 'http://amaras-tech.co.uk/software/memory_usage'
       s.authors      = "Morgan Prior"
       s.email        = "memory_usage_gem@amaras-tech.co.uk"
       s.description  = "Reports memory used by all current user processes"
       s.files        = ['bin/my_gem', 'lib/my_gem.rb']
       s.bindir       = 'bin'   
       s.executables  = ['my_gem']
       s.has_rdoc     = false

       s.post_install_message = "To use 'my_gem' as a standalone application your gems folder must be on your path"   
    end
    Rake::GemPackageTask.new(spec).define

bin/my_gem

    #!/usr/bin/env ruby

    require 'rubygems'
    require 'my_gem'

    a = MyGem.new(ARGV)
    a.report

lib/my_gem.rb

    class MyGem
        #Any command Line options set are passed in as array argv
        # You cannot have arguments as CONSTANTS plus if it was 
        # ARGV it would clash with the built in ARGV.
        def initialize(argv=[""])
          @msg = "HelloWorld!"
        end

        def report
           puts @msg.to_s
        end
     end

Then :

    $ gem build my_gem.gemspec

and you can test the install via:

    $ gem install my_gem-0.0.1.gem

Test then uninstall:

    $ gem uninstall my_gem

Push to RubyGems:

    $ gem push my_gem-0.0.1.gem

Then install from ruby Gem:

    $ gem install my_gem

Done, Remember to replace 'my_gem' with a unique but relevant name.
