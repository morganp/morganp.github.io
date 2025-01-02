---
layout: post
title: "brew update fail"
date: 2014-02-11 21:17:24 +0000
comments: true
categories: Tech
tags:
- OS X
- brew
---

Received the following errors when doing `brew update` on mountain lion:

    error: The following untracked working tree files would be overwritten by merge:
            Library/Formula/platypus.rb
    Please move or remove them before you can merge.
    Aborting
    Error: Failure while executing: git pull -q origin refs/heads/master:refs/remotes/origin/master

A solution found on [Stackoverflow](http://stackoverflow.com/questions/10762859/brew-update-the-following-untracked-working-tree-files-would-be-overwritten-by)

    cd /usr/local
    git fetch origin
    git reset --hard origin/master
