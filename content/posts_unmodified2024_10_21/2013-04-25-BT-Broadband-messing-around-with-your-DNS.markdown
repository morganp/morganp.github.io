---
layout: post
title: "BT Broadband messing around with your DNS"
date: 2013-04-25 09:02:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Network
discuss_url: //218
url: //218/BT_Broadband_messing_around_with_your_DNS
id: 218
---
BT broadband has **BT Web Address Help** enabled by default. This allows then to redirect you to another site if they think you typed the URL incorrectly.

This can cause problems when connecting to a VPN, which is setup to no route normal websites through the VPN. When the URL is rejected your VPN then picks it up as a fall back and tries over its connection. However when these Smart systems are enabled by your isp they will never reject them and always try to offer useful content.
 
To [turn off your BT Web Address Help][bthelp] go to : [BT Preferences][bthelp]. You can read more about it in [this discussion][btdiscus].

[bthelp]: http://preferences.webaddresshelp.bt.com/selfcare/preferences.cgi
[btdiscus]: http://bt.custhelp.com/app/answers/detail/a_id/14244/c/346,402,405

