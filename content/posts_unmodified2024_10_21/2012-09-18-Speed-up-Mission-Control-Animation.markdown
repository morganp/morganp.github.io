---
layout: post
title: "Speed up Mission Control Animation"
date: 2012-09-18 16:18:56 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Mountain Lion
- Productivity
discuss_url: //195
url: //195/Speed_up_Mission_Control_Animation
id: 195
---
If entering Mission Control (ctrl-up) is taking to long you can speed up the animation entering the following in the Terminal (/Applications/Utilities/Terminal.app):

    defaults write com.apple.dock expose-animation-duration -float 0.2; killall Dock

To disable the animation altogether :

    defaults write com.apple.dock expose-animation-duration -float 0; killall Dock

I prefer to have a fast animation rather than none as it provides context, it shows me where the applications are coming from on the screen.
