---
layout: post
title: "Mac OS X run nginx as a user process"
date: 2010-05-11 12:51:49 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- nginx
- Web
discuss_url: //32
url: //32/Mac_OS_X_run_nginx_as_a_user_process
id: 32
---
I do not like having to use sudo to run development servers for testing web applications. sudo should be reserved for commands that really need that level of privilege. After [installing passenger and nginx][passenger] on Mac OS X Snow Leopard I had trouble getting nginx to run without sudo.

NB: sudo runs the command with superuser privileges ie things that could break your system if you do not know what you are doing, or typo a command so should be used sparingly.

if you have been running with sudo stop the service

    $ sudo nginx -s stop

find and remove the log files for me this is:

    $ rm -rf ~/bin/nginx/logs/*

Assuming nginx is on your path (if not you must know its location) to find its location you can try which ie:

    $ which nginx

A few changes to the default config file:

    vim ~/bin/nginx/conf/nginx.conf

    #user morgy; #<-- comment out when running as user process
    worker_processes  1;

    http {
       passenger_root /path/ruby-ee-1.8.7/lib/ruby/gems/1.8/gems/passenger-2.2.11;
       passenger_ruby /path/ruby-ee-1.8.7/bin/ruby;

       include       mime.types;
       default_type  application/octet-stream;
    
       client_max_body_size 20M;

       server {
          listen       8080; #<-- superuser only has acess to 80
          server_name  localhost, www.localhost;
          passenger_enabled on;
          root /your/path/public;   # <--- be sure to point to 'public'!
       }
    }


That is all I had to do to get nginx working without sudo
    
    $ nginx
    $ nginx -s reload

Just point your browser to localhost:8080 or 127.0.0.1:8080 

[passenger]: http://amaras-tech.co.uk/people/morgan/article/26
