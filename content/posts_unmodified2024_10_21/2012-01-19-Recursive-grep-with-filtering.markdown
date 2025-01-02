---
layout: post
title: "Recursive grep, with filtering"
date: 2012-01-19 15:56:31 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
discuss_url: //135
url: //135/Recursive_grep%2C_with_filtering
id: 135
---
I noticed today that greps recursive function is different to finds recursion. 

    find ./ -name *.txt
    grep -R 'text' *.text

The above find command will search from the sub-directory down while grep will only search the current folder. The FILE_PATTERN must also match the hierarchy in grep.

To apply a file type filter in grep you can do:

    grep -R --include=*.txt 'text' ./

This looks at all file from the current directory (./) but will only grep files which match the include.

An older article on [Basic grep usage][].

[Basic grep usage]: http://amaras-tech.co.uk/article/63
