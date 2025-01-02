---
layout: post
title: "Ruby: optionally add path separator"
date: 2013-06-05 11:46:58 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //223
url: //223/Ruby%3A_optionally_add_path_separator
id: 223
---
I was wanting to use Dir.glob to get a file list and wanted to do `Dir.glob( path + '*')` but nicely handle when the final '/' of path was missing.

Instead of doing string manipulation we should just be using the file utilities.

    Dir.glob( File.join( path, '*')  ) 
