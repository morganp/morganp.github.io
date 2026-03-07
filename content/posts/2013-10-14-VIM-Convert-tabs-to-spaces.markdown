---
layout: post
title: "VIM: Convert tabs to spaces"
date: 2013-10-14 09:23:03 +0100 
comments: true
sharing: true
footer: true
Category: Unix & Tools
tags: Vim
discuss_url: //237
id: 237
---
Good programming practice is to use spaces to indent code rather than tabs. Due to tabs often being rendered differently by editors and personal configurations. 

In vim this will convert tabs to space based on your current tab width settings: 

    :retab

To view white space characters (tabs will show as ^I) 

    :set list
