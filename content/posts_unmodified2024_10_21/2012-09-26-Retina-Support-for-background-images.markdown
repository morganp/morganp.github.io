---
layout: post
title: "Retina Support for background images"
date: 2012-09-26 21:07:35 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- CSS
- Web
discuss_url: //196
url: //196/Retina_Support_for_background_images
id: 196
---
This is based on a [guide to adding retina support to websites][guide].

To add a tiled (repeating) background cretae 2 images one at 100x100px and the other with the '_@2' added to the file name at 200x200px then use the following css.

    body {background: url(../images/bg.png) repeat; background-size: 100px 100px;}

    @media only screen and (-webkit-min-device-pixel-ratio: 2) {
       body {background: url(../images/bg_@2x.png) repeat;}
    }

[guide]: http://www.kylejlarson.com/blog/2012/creating-retina-images-for-your-website/
