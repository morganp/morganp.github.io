---
layout: post
title: "Matlab toolboxes with absolute path setup"
date: 2014-05-07 18:22:48 +0100
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Matlab
---

When a script or function is called with `run(./relative/path/script)` the working directory is changed to the `./relative/path`. This means `pwd` it can be used to specify absolute paths:

    run(./libs/example_toolbox/load_toolbox)

Which contains :

    addpath([pwd, '/function']);

Now  The path will contain `C:/ ... /libs/example_toolbox/function`

As shown in the example this is useful for toolboxes etc which could be distributed with a top level script which adds the toolbox functions on to the path.



