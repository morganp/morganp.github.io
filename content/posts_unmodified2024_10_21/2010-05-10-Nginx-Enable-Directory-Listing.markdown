---
layout: post
title: "Nginx Enable Directory Listing"
date: 2010-05-10 14:07:23 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Web
- nginx
discuss_url: //30
url: //30/Nginx_Enable_Directory_Listing
id: 30
---
Directory listing can be enabled (disabled by default) by adding this:

    autoindex on;

Example usage

    http{
       server {
         #Server with no Directory listing
         listen 80
       }
       server {
          #Server with Directory listing
          autoindex on;
          listen 8080
       }
    }


Original [source][] 
[source]: http://justinbkay.org/2007/12/23/nginx-enable-directory-listing
