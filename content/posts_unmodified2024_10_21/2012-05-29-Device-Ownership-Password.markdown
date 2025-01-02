---
layout: post
title: "Device Ownership Password"
date: 2012-05-29 09:19:24 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Microsoft
- Network
discuss_url: //168
url: //168/Device_Ownership_Password
id: 168
---
While using a pool laptop from work and trying to connect to my home wifi I am prompted for my Device Ownership Password. It will only accept numerics, I believe this is requesting the 'Security Pin' which is stamped on the bottom of my netgear router.

This is only happening because the laptop is using Intel(R) PROSet/Wireless Software, no other devices I have ever ask for this.

It can be disabled by:

    Control Panel -> 
      add or remove programs -> 
        Intel(R) PROSet/Wireless Software -> 
          Repair -> 
            Modify -> 
              WI-FI PROTECTED SETUP (change to not installed)

Now connecting to the WiFi I am just prompted for my network password, like all other devices.


Answer originally found [here][source].

[source]: http://forums.anandtech.com/showthread.php?t=274465
