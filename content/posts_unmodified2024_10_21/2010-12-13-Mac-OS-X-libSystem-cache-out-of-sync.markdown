---
layout: post
title: "Mac OS X libSystem cache out of sync"
date: 2010-12-13 11:52:06 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- OS X
discuss_url: //81
url: //81/Mac_OS_X_libSystem_cache_out_of_sync
id: 81
---
For various reasons Mac OS X (at least 10.6) can get the system cache out of sync with the libraries on disk. The error you should might see is:

    > dyld: shared cached file was build against a different libSystem.dylib, ignoring cache

From [Source][], to fix it run:

    $ sudo update_dyld_shared_cache -force

[Source]: http://blog.sensibleopensource.com/what_is_dyld_and_how_to_clear_the_shared_cache.htm
