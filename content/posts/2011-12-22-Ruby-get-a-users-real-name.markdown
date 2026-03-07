---
layout: post
title: "Ruby get a users real name"
date: 2011-12-22 12:06:08 +0000 
comments: true
sharing: true
footer: true
Category: Programming
tags: Ruby, Git
discuss_url: //132
id: 132
---
There does not appear to be a nice way to get a current users real name in ruby. The best way I have found on \*nix systems (Not windows) is:

    %x{finger `whoami`}.match(/Name: ([\w ]*)/)
    real_username = $1


There are other ways including parsing the git profile if it exists. At some point I will try to get these packaged up into a gem which can work its way through a list of possible sources.
