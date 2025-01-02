---
layout: post
title: "Mac OS X Harddrive Spin Down Time"
date: 2010-09-01 13:05:32 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- OS X
- Performance
- Power
discuss_url: //66
url: //66/Mac_OS_X_Harddrive_Spin_Down_Time
id: 66
---
The Preferences menu in OS x give you the option to turn off Hard Disks whenever possible to save power however the default 10 minutes idle before shutdown can not be adjusted from this panel. This could also be causing excessive ware on desktop 3.5" drives.

If you have the developer tools installed then you should have the SpindownHD tool. located in /Developer -> Applications -> Performance Tools -> CHUD -> Hardware

If you do not have the developer tools installed there is no need just for this tool the changes can be made manually be editing: Library -> Preferences -> SystemConfiguration -> com.apple.PowerManagement.plist
under 'Disk Sleep Timer' adjust the minutes of idle time before shutting drives down.


[source1][]
[source2][]
[source1]: http://hints.macworld.com/article.php?story=20050601044914357
[source2]: http://hints.macworld.com/article.php?story=20060922231408751
