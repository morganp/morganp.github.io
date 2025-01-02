---
layout: post
title: "Sinatra and compass sending compressed cached CSS"
date: 2010-03-30T14:50:00+00:00 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Sinatra
- Compass
- SASS
- CSS
discuss_url: //3
url: //3/Sinatra_and_compass_sending_compressed_cached_CSS
id: 3
---
I have previously mentioned on [blogger][munkyblog] how to use Compass and SASS with Sinatra for rendering the stylesheets.

I have added a few options which are not in the main tutorials. Compress the stylesheet, this removes all the white space saving bandwidth when transmitting the file.


    configure do
    ....

      ##Compass CSS/SASS stuff below
      Compass.configuration do |config|
         config.project_path = File.dirname(__FILE__)
         config.sass_dir = 'views/stylesheets'
         config.output_style = :compressed
      end
    end

The second setting is to tell browsers to cache the stylesheet so that passenger does not have to keep building the file via compass.

    ##CSS rendering
    get '/stylesheets/:name.css' do
       content_type 'text/css', :charset => 'utf-8'
       response['Expires'] = (Time.now + 60*60*24*356*3).httpdate
       sass(:"stylesheets/#{params[:name]}" )
    end


[munkyblog]: http://munkymorgy.blogspot.com/
