---
layout: post
title: "Sinatra Heroku and config.ru"
date: 2010-11-03 16:43:22 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Heroku
- Programming
- Rack
- Ruby
- Sinatra
discuss_url: //78
url: //78/Sinatra_Heroku_and_config.ru
id: 78
---
Rack applications often require a config.ru for deployment. The standard config.ru for classic sinatra applications is well documented:

    require 'app'
    run Sinatra::Application

The requirments for classy apps is not very well documented, currently I use this on heroku:

    #For Ruby 1.8.7 (the 1.9.2 version should also work) on Heroku
    require 'app'
    run MyModule::MyApp

After trying Ruby 1.9.2 I had to add ./ to my app require. The current directory has been removed from the load path adding ./ removes the problem because it explicitly defines the path.

    #For Ruby 1.9.2 on Heroku
    require './app'
    run MyModule::MyApp

For a sinatra Application which may look like:

    require 'sinatra/base'
    module MyModule
      class MyApp < Sinatra::Base
        get '/' do
          'HelloWorld!'
        end
      end
    end
    
    #if file called directly launch app (ie ruby my_app.rb)
    if $0 == __FILE__
      MyModule::MyApp.run!
    end


