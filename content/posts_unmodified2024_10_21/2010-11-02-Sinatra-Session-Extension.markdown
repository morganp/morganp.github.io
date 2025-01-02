---
layout: post
title: "Sinatra Session Extension"
date: 2010-11-02 12:49:03 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Gem
- Programming
- Ruby
- Sinatra
discuss_url: //77
url: //77/Sinatra_Session_Extension
id: 77
---
I have just started to use a [sinatra extensions][sinatra-extensions] called [Sinatra Session][sinatra-session]. The write up on the [main site][sinatra-session] is pretty good and only include a short summary below.

    gem install sinatra-session

In your app (classy style)

    require 'sinatra/base'
    require 'sinatra/session'

    class MyApp < Sinatra::Base
      register Sinatra::Session

      # Use helpers as required
      get '/' do
        session_start!
        session[:foo] ||= 'bar'

        #now view helper, etc, can call session[:foo] to get value 'bar'
      end

    end



[sinatra-extensions]: http://www.sinatrarb.com/extensions.html
[sinatra-session]: http://mjijackson.com/sinatra-session/
