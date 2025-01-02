---
layout: post
title: "Amazon Drops EC2 Web Service Prices"
date: 2010-09-09 02:24:49 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Heroku
- Memory
- Performance
- Programming
- Web
- WebFaction
discuss_url: //69
url: //69/Amazon_Drops_EC2_Web_Service_Prices
id: 69
---
The new [EC2-Pricing][] also includes a new Micro service. This micro service is intended for small apps servicing tens of requests per second.

The standard price (EU) is $0.025 so if it was running 24/7/365 that would be:  

    (24*365*0.025) = $219 or $18.25/month  

[Webfaction][] can run the same thing for $9.50 a month, limited to fair use of 80MB memory.

With a 1 year Reserved instance, $54 + $0.01 hourly charge this drops to $11.8/month.  

    ((24*365*0.01)+54)/12 = 11.8

This could be dropped further with a 3 year Reserved instance.  

    ((24*365*0.01*3)+82)/36 = $9.58/month

If the web then stays deactivated for half this time (site is country specific or only popular around new article posts) then this could drop the monthly cost down to $5.92  

    ((12*365*0.01*3)+82)/36

[EC2-Pricing]: http://aws.amazon.com/ec2/#pricing
[Webfaction]: http://www.webfaction.com/?affiliate=morgy
