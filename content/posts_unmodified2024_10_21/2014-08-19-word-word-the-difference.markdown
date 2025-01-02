---
layout: post
title: "Word WORD the Difference"
date: 2014-08-19 06:27:30 +0100
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- Vim
published: true
---

Just realised there is a difference between word and WORD in Vim.

WORD is non-blank delimited by whitespace.
word is alpha-numeric and other non-blank characters delimited by whitespace and punctuation. 'iskeyword' can be used to move delimiters in to part of the selection of the word.

by default :

    this-is-four-words
    this-is-one-WORD
