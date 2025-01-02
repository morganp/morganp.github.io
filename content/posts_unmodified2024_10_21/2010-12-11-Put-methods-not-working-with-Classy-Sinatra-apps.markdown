---
layout: post
title: "Put methods not working with Classy Sinatra apps"
date: 2010-12-11 05:38:06 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Sinatra
discuss_url: //80
url: //80/Put_methods_not_working_with_Classy_Sinatra_apps
id: 80
---
Since moving to Classy Sinatra applications I have not been able to get put and delete methods to work correctly. This is because sinatra/base does not include the rack method override 'stuff'.

    require 'rubygems'
    require 'sinatra/base'
    module MyModule
      class MyApp < Sinatra::Base
        use Rack::MethodOverride ##<-- Required for put delete
      
        get '/' do
        '<form method="post" action="/">' + 
        '  <input  type="hidden" name="_method" value="put" />' +
        '  <button type="submit"> Test PUT</button><br  />' +
        '</form>'
        end

        put '/' do
          'PUT works'
        end
      end
    end

    if $0 == __FILE__
      MyModule::MyApp.run!
    end



