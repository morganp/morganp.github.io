---
layout: post
title: "Xcode 4 Install, Disk Usage"
date: 2012-08-16 10:27:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Mountain Lion
- XCode
discuss_url: //181
url: //181/Xcode_4_Install%2C_Disk_Usage
id: 181
---
[Some info on what has changed in Xcode 4.3][xcode4.3]. Latest is 4.4 but a lot changed in 4.3 making this a good reference point.

Downloaded the XCode app, but not executed, the file system looked like:

      29G    /
    5.0G	/Applications
    2.5G	/Library
      0B	/Network
    3.1G	/System
    4.0K	/User Information
    280M	/Users
    259G	/Volumes
    2.7M	/bin
      0B	/cores
    4.5K	/dev
    4.0K	/etc
    1.0K	/home
    7.8M	/mach_kernel
    1.0K	/net
     17G	/private
    1.5M	/sbin
    4.0K	/tmp
    360M	/usr
    4.0K	/var

Executed `/Applications/Xcode.app` and installed command line tools:

     29G     /

    5.0G	/Applications
    2.5G	/Library
      0B	/Network
    3.2G	/System
    4.0K	/User Information
    405M	/Users
    259G	/Volumes
    2.7M	/bin
      0B	/cores
    4.5K	/dev
    4.0K	/etc
    1.0K	/home
    7.8M	/mach_kernel
    1.0K	/net
     17G	/private
    1.5M	/sbin
    4.0K	/tmp
    453M	/usr
    4.0K	/var

[xcode4.3]: http://developer.apple.com/library/ios/#documentation/DeveloperTools/Conceptual/WhatsNewXcode/Articles/xcode_4_3.html

