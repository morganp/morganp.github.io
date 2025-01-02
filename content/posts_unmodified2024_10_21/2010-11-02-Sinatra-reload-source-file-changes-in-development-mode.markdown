---
layout: post
title: "Sinatra reload source file changes in development mode"
date: 2010-11-02 11:03:26 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Gem
- Programming
- Rack
- Ruby
- Sinatra
discuss_url: //76
url: //76/Sinatra_reload_source_file_changes_in_development_mode
id: 76
---
[Sinatra Reloader][github] is a sinatra extension which reloads source files while in development mode, this functionality was removed from base sinatra in 0.9.2

    gem install sinatra-reloader

In your app (classy style)

    require "sinatra/base"
    require "sinatra/reloader"

    class Foo < Sinatra::Base
      configure(:development) do
        register Sinatra::Reloader
        also_reload "models/*.rb"
        also_reload "helpers/*.rb"
        #dont_reload "lib/**/*.rb"
      end
    end


[Source][github]

[github]: http://github.com/rkh/sinatra-reloader
