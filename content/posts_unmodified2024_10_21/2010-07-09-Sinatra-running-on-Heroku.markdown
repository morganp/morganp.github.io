---
layout: post
title: "Sinatra running on Heroku"
date: 2010-07-09 08:37:13 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Sinatra
- Heroku
- Web
discuss_url: //51
url: //51/Sinatra_running_on_Heroku
id: 51
---
For running small webapps [heroku][] is free. The real attraction is the simplicity of deployment, if you are use to git you just push to heroku.

[Current instructions][deploy] are missing the step of creating the .gems file. So here is my quick walk through. Register on [heroku][] first.

    mkdir new_web_app
    cd new_web_app
    gem install heroku
    touch config.ru
    touch app.rb
    touch .gems
    
config.ru

    require 'app'
    run Sinatra::Application

app.rb

    
    require 'rubygems'
    require 'sinatra'

    get '/' do
       "Hello from Sinatra on Heroku!"
    end

.gems

    sinatra --version '>=1.0'

Now run these commands to finish off and deploy

    git init
    git add config.ru app.rb .gems 
    git commit -a -m 'Initial commit'
    heroku create
    git push heroku master
    heroku open
    

[heroku]: http://heroku.com/
[deploy]: http://blog.heroku.com/archives/2009/3/5/32_deploy_merb_sinatra_or_any_rack_app_to_heroku/
