---
layout: post
title: "OS X Screen Capture"
date: 2012-10-15 19:28:16 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Mountain Lion
- OS X
discuss_url: //203
url: //203/OS_X_Screen_Capture
id: 203
---
To capture the screen on OS X :

⇧⌘4 : Selected area to capture.  
⇧⌘4-space : Capture a window.

These are defined in the System Preferences.

<a href="http://www.flickr.com/photos/morgan_prior/8091257767/" title="OS X Screen Capture by munky morgy, on Flickr"><img src="http://farm9.staticflickr.com/8466/8091257767_94369b4008.jpg" width="500" height="455" alt="OS X Screen Capture"></a>

To change the captured image from the Terminal (/Applications/Utilities/Terminal.app) type

Jpeg:
--

    defaults write com.apple.screencapture type jpg
    killall SystemUIServer

PNG
--

    defaults write com.apple.screencapture type png
    killall SystemUIServer

Tiff
--

    defaults write com.apple.screencapture type tiff
    killall SystemUIServer

PDF
--

    defaults write com.apple.screencapture type pdf
    killall SystemUIServer
