---
layout: post
title: "Trying to disable Caps Lock on Unix systems"
date: 2012-04-02 09:45:19 +0100 
comments: true
sharing: true
footer: true
Category: Tech
tags: Command Line,
discuss_url: //145
url: //145/Trying_to_disable_Caps_Lock_on_Unix_systems
id: 145
---
Entering the following command in to your .bashrc seems like a simple way forward.

    xmodmap -e "remove lock = Caps_Lock"

However generates the following error when loading multiple terminals

    xmodmap:  commandline:0:  bad keysym in remove modifier list 'Caps_Lock', no corresponding keycodes
    xmodmap:  1 error encountered, aborting.

This appear to be a safer variant with out the errors when reloading your .bashrc

    xmodmap -e "clear lock"
