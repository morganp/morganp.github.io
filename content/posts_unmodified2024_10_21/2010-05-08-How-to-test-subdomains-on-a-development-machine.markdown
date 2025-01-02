---
layout: post
title: "How to test subdomains on a development machine"
date: 2010-05-08 05:04:51 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Web
- nginx
discuss_url: //28
url: //28/How_to_test_subdomains_on_a_development_machine
id: 28
---
I recently documented how I [installed Ruby Enterprise and nginx on Mac OS X][amaras-26]. Here we see how to make subdomains work on your local development machine using [nginx][]. These instructions should be relevant for most unix based systems. 

Why use subdomains. On shared hosts like [webfaction][] it is more efficient to serve images, downloads, etc from a nginx server rather than run them through your web application, like rails, sinatra, etc.

First modify you hosts file, adding in all the subdomains you need.   

    $ vim /etc/hosts

    127.0.0.1     localhost
    127.0.0.1     downloads.localhost

Then modify the nginx.config file, making it listen for the new subdomains.

    http { 
       server {
          listen       80;
          server_name  localhost;
          passenger_enabled on;
          root /Users/Shared/Code/Amaras-Site/public;   # <--- be sure to point to 'public'!
       }

       server {
          listen 80;
          server_name downloads.localhost;
          root  /Users/Shared/Code/Amaras-Site/Uploads; # <-- Not a Rack application just plain static files
       }
    }


NB: to find the location of your nginx.conf file:
 
    $ find / -iname "nginx.conf"


Start or restart the nginx server

    $ sudo ~/bin/nginx/sbin/nginx
    $ sudo ~/bin/nginx/sbin/nginx -s reload

For portability in Sinatra applications I refer to subdomains using this method:

    <% url = request.env["HTTP_HOST"] %>
    <a href="http://downloads.<%=url%>/something">link to subdomain</a>

[amaras-26]: http://amaras-tech.co.uk/people/morgan/article/26
[nginx]: http://nginx.org/
[webfaction]: http://www.webfaction.com?affiliate=morgy

