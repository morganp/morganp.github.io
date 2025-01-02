---
layout: post
title: "Stop git status monitoring file permissions"
date: 2010-05-08 06:52:33 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Git
- Programming
discuss_url: //29
url: //29/Stop_git_status_monitoring_file_permissions
id: 29
---
By default git status returned differences in file permissions. To turn if off run:

    $ git config core.filemode false
