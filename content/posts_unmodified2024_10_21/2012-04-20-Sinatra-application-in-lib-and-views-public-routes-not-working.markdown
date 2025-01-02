---
layout: post
title: "Sinatra application in ./lib and views, public routes not working"
date: 2012-04-20 23:26:34 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Heroku
- Programming
- Rack
- Ruby
- Sinatra
- Web
- WebFaction
discuss_url: //149
url: //149/Sinatra_application_in_.%2Flib_and_views%2C_public_routes_not_working
id: 149
---
I have been setting up my recent Sinatra projects with a standard ruby project layout putting all of the application code within a lib folder. When running locally I have been cding in to the lib folder and just running: 

    ruby app.rb

I often found that when deploying (WebFaction or Heroku) that I had to make several attempts to get the config.ru correct. I then found that thin can load and run using the config.ru.

    thin start --port 4567 -R config.ru

Which worked until I tried it on a non trivial application which used (erb) templates and then I started seeing these errors, when viewing 127:0.0.1:4567

    Errno::ENOENT at /
    No such file or directory - ./views/home.erb
    file: template.rb location: binread line: 67

The problem is that we are now a level above where we use to be, not sure whay this has never been a problem in production before. 

    module AnotherWebApp
      VERSION = '0.0.1'
      class App < Sinatra::Base
        use Rack::MethodOverride
        #set :public_folder, "public" # <-- Old version
        set :public_folder, "#{File.dirname(__FILE__)}/public"   # <-- New Version
        
        # Older ersions of Thin/Sinatra May require
        set :public, "#{File.dirname(__FILE__)}/public"              # <-- public changed to public_folder in newer release
        set :views, "#{File.dirname(__FILE__)}/views"                # <-- Need to set View
    
        get '/' do
          erb :home
        end

      end
    end

