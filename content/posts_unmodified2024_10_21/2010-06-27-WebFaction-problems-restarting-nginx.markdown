---
layout: post
title: "WebFaction problems restarting nginx"
date: 2010-06-27 09:39:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- nginx
- Sinatra
- Web
- WebFaction
discuss_url: //47
url: //47/WebFaction_problems_restarting_nginx
id: 47
---
After updating my website on [webfaction][] nginx kept saying permission denied and when I tried to view my site I got a 502 Bad Gateway error page.

To restart nginx I use to call:

      ~/webapps/passenger/bin/restart

I had to change this to:

    ~/webapps/passenger/nginx/sbin/nginx -p ~/webapps/passenger/nginx/ -s stop  
    ~/webapps/passenger/nginx/sbin/nginx -p ~/webapps/passenger/nginx/ 

[webfaction]: http://www.webfaction.com/?affiliate=morgy
