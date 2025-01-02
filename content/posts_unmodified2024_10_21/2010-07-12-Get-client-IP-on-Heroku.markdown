---
layout: post
title: "Get client IP on Heroku"
date: 2010-07-12 07:41:32 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Heroku
- Programming
- Ruby
- Sinatra
- Web
- Rack
discuss_url: //52
url: //52/Get_client_IP_on_Heroku
id: 52
---
I have been trying to use the [GeoIP Rack App][coderack], by copying this [gist][geogist] in my Rack stack with a Sinatra Application. Heroku has a lot of redirection in there Server farm so I have added the following lines to my instance of GeoIP:Rack to make it Heroku safe.

    env['HTTP_X_REAL_IP'] ||= env['REMOTE_ADDR']
    res = @db.country(env['HTTP_X_REAL_IP'])

[geogist]: http://gist.github.com/208774
[coderack]: http://coderack.org/users/hosiawak/middlewares/36-geoip-country
