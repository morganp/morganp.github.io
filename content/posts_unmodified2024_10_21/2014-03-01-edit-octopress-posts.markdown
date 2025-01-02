---
layout: post
title: "Edit Octopress Posts"
date: 2014-03-01 19:28:17 +0000
comments: true
categories: Tech
tags:
- Octopress
- Vim
- Command Line
---

Creating new posts in Octopress is `rake new_post["Edit Posts"]` which outputs the created filename. 

Posts are prefixed with date, which can make it difficult to find a particular post to edit. Tab completion can help if you known the year of the post but it may still list 100's of posts where you have to spot the title, and narrow it done via month and day. To get around this I use this script to launch matching posts in my editor:

    #!/bin/bash
     
    editor="mvim"
    post_path="source/_posts/"
     
    for OUTPUT in $(ls $post_path | grep $1)
    do
      file_list="$file_list $post_path$OUTPUT"
    done
     
    $editor $file_list
