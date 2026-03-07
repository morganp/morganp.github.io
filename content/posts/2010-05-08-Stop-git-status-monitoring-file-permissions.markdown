---
layout: post
title: "Stop git status monitoring file permissions"
date: 2010-05-08 06:52:33 +0100 
comments: true
sharing: true
footer: true
Category: Unix & Tools
tags: Git
discuss_url: //29
id: 29
---
By default git status returned differences in file permissions. To turn if off run:

    $ git config core.filemode false
