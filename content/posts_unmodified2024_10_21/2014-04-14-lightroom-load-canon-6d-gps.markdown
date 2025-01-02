---
layout: post
title: "Lightroom Load Canon 6D GPS"
date: 2014-04-14 19:01:06 +0100
comments: true
sharing: true
footer: true
categories: 
- Photography
tags:
- GPS
- Lightroom
---

Adobe Lightroom will only load GPX, Canon 6D only saves NMEA data.

[GPSBabel](http://www.gpsbabel.org/) can be used to convert the `*.log` from the camera to `*.gpx`.

Download the software then load the log file for the input setting the type to `NMEA 0183 sentences`.

Set the output file name and set the format to `GPX XML`. Click OK to generate the GPX which can now be loaded into Lightroom.
