---
layout: post
title: "Basic grep usage"
date: 2010-08-20 07:20:22 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- OS X
- Linux
discuss_url: //63
url: //63/Basic_grep_usage
id: 63
---
Grep is a unix (and mac os x) command line tool to search files for text.  
1) Search for all files containing 'text' in current directory.

    grep text *

2) Addline number to found matches.

    grep -n text *

3) Search for all files containing 'text' in current and sub directories.

    $ grep -R text *

4) Search for files containing 'text' in word only mode (Perl regular expressions).

    $ grep -P '\btext\b' *

5) and remove '//' comments.

    $ grep -P '\btext\b' * | grep -v -P '://'

Remember for more info 

    $ man grep
    $ info grep
