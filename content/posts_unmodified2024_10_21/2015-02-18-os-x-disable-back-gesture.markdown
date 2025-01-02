---
layout: post
title: "OS X disable back gesture"
date: 2015-02-18 18:26:07 +0000
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- OS X
---

After accidentally scrolling back a page when browsing the web in chrome too many times. Figured out how to disable it: from your terminal

    defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE

[From 
http://apple.stackexchange.com](http://apple.stackexchange.com/questions/21236/how-do-i-disable-chromes-two-finger-back-forward-navigation).
