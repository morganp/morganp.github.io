---
layout: post
title: "Command line bulk file rename"
date: 2014-09-05 18:06:05 +0100
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- Programming
- Command Line
published: false
---

To prepend to to filenames

    cd to_folder
    ls | xargs -I {} mv {} addthis-{}

or target jpgs

    cd to_folder
    ls *.jpg | xargs -I {} mv {} addthis-{}



http://www.peteryu.ca/tutorials/shellscripting/batch_rename
