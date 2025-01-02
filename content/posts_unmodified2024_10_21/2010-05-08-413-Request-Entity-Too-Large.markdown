---
layout: post
title: "413 Request Entity Too Large"
date: 2010-05-08 03:22:08 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Web
- nginx
discuss_url: //27
url: //27/413_Request_Entity_Too_Large
id: 27
---
The '413 Request Entity Too Large' Error message is because you have filled in a form and are submitting it with too much data in the form. Typically this comes from uploading files.

The default size for [nginx][] seems to be around 1MB.

To increase the form size limit update your nginx.conf with :

    http {
       client_max_body_size 20M;
    
       server {
          ...
       }
    }

To find the location of your nginx.conf file you can run:

    find / -iname "nginx.conf"


[nginx]: http://nginx.org/
