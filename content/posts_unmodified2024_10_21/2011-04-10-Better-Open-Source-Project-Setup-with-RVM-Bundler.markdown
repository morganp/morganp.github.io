---
layout: post
title: "Better Open Source Project Setup, with RVM & Bundler"
date: 2011-04-10 06:35:10 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Bundler
- Programming
- Ruby
- RVM
- Open Source
discuss_url: //99
url: //99/Better_Open_Source_Project_Setup%2C_with_RVM_%26_Bundler
id: 99
---
Based on 'Raise the bar, lower the pressure' given by Durran Jordan at ScotRubyConf 2011.

There has been some debate as to whether the project .rvmrc should be included in git. With the correct options including .rvmrc and bundler can make working on open source projects easier. I have an example on [github][]. If you have not hear of Ruby Version Manager RVM I suggest you [check it out][rvm].

An example project .rvmrc

    rvm_gemset_create_on_use_flag=1
    rvm 1.9.2@OpenSourceExample

The first line is really important here on first time cd'ing into the folder it creates the gemset instead of outputting a warning that it does not exist.

The second line specifies the version of ruby to use and defines the name of the gemset. Gemsets create a sandboxed gem area so that it does not pollute your global gem space.

[Bundler][] is then used to manage the gems.

Install Bundler
---------------

Bundler requires gem --version greater than 1.3.6, but it is a good idea to upgrade.

    cd OpenSourceExample
    gem update --system
    rvm gemset global
    gem install bundler
    cd .. && cd -

Write your [gemfile][http://gembundler.com/gemfile.html]   
1) With at least 1 source   
2) If the gem install has a different name to require then :require has to be specified eg. 

   gem install sinatra-session
   *.rb  contains require "sinatra/session"

Example ./gemfile

    source "http://rubygems.org"   
    
    gem "sinatra", "~> 1"    
    gem "sinatra-session", :require => 'sinatra/session'
    
    group :development do
      gem "sinatra-reloader", "~> 0"
      gem "thin", "~> 1"
    end

    group :test do
      gem "rspec", :require => "spec"
    end


Then install the gems specified and add the gemfile and Gemfile.lock to git

    $ bundle install
    $ git add gemfile Gemfile.lock

Workflow
--------

When picking up an open source project set up like this, the workflow should just be:

    $ git clone https://github.com/morganp/OpenSourceExample
    $ cd OpenSourceExample
    #Review the .rvmrc and type yes if it is safe
    $ bundle install

[Bundler]: http://gembundler.com/
[rvm]: https://rvm.beginrescueend.com/rvm/install/
[github]: https://github.com/morganp/OpenSourceExample
