---
layout: post
title: "Mac Mountain Lion Compatibility"
date: 2012-07-16 06:52:09 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Mountain Lion
- OS X
discuss_url: //175
url: //175/Mac_Mountain_Lion_Compatibility
id: 175
---
One of the limitations of mountain lion is that they are only going to support 64 bit Kernel extensions, the graphics drivers are are loaded as a kernel extension and some of the older macs (mac pro, iMac, MacBook, MacBook pro) only have a 32bit graphics driver (Kernel extension) avilable and so will not be supported by Mountain Lion.

To check just run this from your terminal (/Applications/Utilities/Terminal.app) :

    ioreg -l -p IODeviceTree | grep firmware-abi

If it is supported the result should look some thing like:

        | |   "firmware-abi" = <"EFI64">

If you device is not supported you will get:

        | |   "firmware-abi" = <"EFI32">

[Source](http://arstechnica.com/apple/2012/07/confirmed-mountain-lion-sends-some-64-bit-macs-gently-into-that-good-night/)
