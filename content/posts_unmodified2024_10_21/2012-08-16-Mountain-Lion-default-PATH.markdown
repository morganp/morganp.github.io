---
layout: post
title: "Mountain Lion default $PATH"
date: 2012-08-16 09:25:37 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Mountain Lion
discuss_url: //179
url: //179/Mountain_Lion_default_%24PATH
id: 179
---
    /usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin

To Reset it back to this value run (from /Applications/Utilities/Terminal.app)

    export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin

NB: Note the removal of X11 from this compared to the Lion path:

    /usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/usr/X11/bin
