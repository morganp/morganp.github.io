---
layout: post
title: "Push local folder to remote server over ssh"
date: 2013-05-10 21:30:00 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Web
discuss_url: //221
url: //221/Push_local_folder_to_remote_server_over_ssh
id: 221
---
After struggling to get the rake task for octopress to deploy I decided to fall back to the command line and use rsync and ssh to push the static website to the server.

To copy the local folder public to webapp/x/ folder on my webserver:

     rsync -avz ./public/  user@server:~/webapps/x/
