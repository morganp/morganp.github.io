---
layout: post
title: "Turn a .jar file into a mac .app"
date: 2010-07-18 05:59:31 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Java
- OS X
- Programming
discuss_url: //55
url: //55/Turn_a_.jar_file_into_a_mac_.app
id: 55
---
Following [this article][source] lets you turn a executable java .jar into a mac appliction (.app). The Tools are only available on Mac OS with Xcode installed.

Basically create a 512x512px png for your logo. then use '/Developer/Applications/Utilities/Icon Composer.app' to create a someFileName.icns, Just drag the png into each of the different size boxes and Icon Composer will resize it correctly.
Then Save.

Second Stage is to start '/Developer/Applications/Utilities/Jar Bundler.app'  
For the main class choose your executable .jar for the icon load the icns created in the previous step. Then press the create application button, chose location then your .app should be created.

The only complaint I have about these to applications is there is no ability to save the set-up, so every time you want to rebuild you have to enter all the settings again, I do not know many other applications which do not allow you to save.

[source]: http://www.centerkey.com/mac/java/
