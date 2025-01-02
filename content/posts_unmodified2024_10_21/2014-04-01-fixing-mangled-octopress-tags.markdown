---
layout: post
title: "Fixing Mangled Octopress Tags"
date: 2014-04-01 20:59:40 +0100
comments: true
categories: Tech
tags:
- Octopress
- Command Line
---

When creating my blog I have been inconsistent with the tag `command line`, `Command line` and
`Command Line` the case in-sensitvities are not picked up in Octopress generation. To some
extent my [Downcase plugin]() hides these differences. The tags page only lists those with full
downcase, but handles all other mixed case tags.

This has lead to some posts dropping off the tag listing, which are just not accessible this way.

The easy fix is to standardise my use of the tag.

First investigate: List posts containing the downcased version:

    grep -R '\- command line' *

Correct all :

    find ./source/_posts -type f -print0 | xargs -I{} sed -i '' 's/\- [Cc]ommand [Ll]ine/\- Command Line/g' {}

`find` outputs all files in folder ‘./‘ Actually had some trouble rerunning this find command so simplified it to :

    ls source/_posts/*.markdown | xargs -I{} sed -i '' 's/\- [Cc]ommand [Ll]ine/\- Command Line/g' {}

**xargs** option `i{}` takes the input argument and repeats it in the following command where the
`{}` are placed. `find` has a built in `-exec` option but using xargs allows the first `find`
command to be replaced with `grep` or `ls` if required.

**Sed** options 

1. `g` Replace all the instances
2. `-i ‘’` Edits inplace without appending a new file extension.

On a Mavericks the default see does not support case insensitive search,
therefore I have enclosed the first letter of each word with options for lower and upper case.

After performing the updates the tag text is updated to `Command Line` and the url is
[`tag/command-line/`](/tag/command-line/), which lists all of the tagged posts. 
