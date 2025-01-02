---
layout: post
title: "Revert in Git"
date: 2014-03-03 19:42:12 +0000
comments: true
categories: Tech
tags:
- Git
- Command Line
---

and Remove Orphaned Commits.
==

I use `gitx` graphical tool on OS X to find the SHAs for commits. Revert back throwing away all changes:

    git reset --hard shaqwerty      

Now delete the orphaned commits.

    git reflog expire --expire=now --expire-unreachable=now --all
    git gc --prune=now
