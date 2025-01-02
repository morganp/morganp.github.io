---
layout: post
title: "uninitialized constant Compass::Logger"
date: 2011-06-23 20:21:03 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Automation
- Compass
- Database
- Gem
- Migrations
- Programming
- Sinatra
- Sequel
discuss_url: //112
url: //112/uninitialized_constant_Compass%3A%3ALogger
id: 112
---
Working on a joint project an error started showing up when trying to perform migrations.

    $ rake db:migrate VERSION=0
    >rake aborted!
    >uninitialized constant Compass::Logger

The Solution was to add a line to the rake file, to correctly load Compass::Logger, still no idea why rake needed it.

    require 'compass/logger'

Another thing to check might be that compass is being loaded before classes which use it. An issue that can happen in Sinatra and Rails apps.

Example Gemfile (for [Bundler][])

    source :rubygems

    gem 'rails', '3.0.9'

    gem "compass"
    gem "haml-rails"
    gem "pg"
    gem "jquery-rails"
    gem "omniauth", '~> 0.2.5'

    group :test do
      gem "capybara"
      gem "factory_girl_rails"
      gem "test-unit"
    end

[Bundler]: http://gembundler.com/
