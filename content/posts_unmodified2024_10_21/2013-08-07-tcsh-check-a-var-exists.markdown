---
layout: post
title: "tcsh check a var exists"
date: 2013-08-07 07:04:38 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
discuss_url: //229
url: //229/tcsh_check_a_var_exists
id: 229
---
To check if an environment variable exists in .mycshrc or shell scripts

    if ($?TERM) then
      echo "TERM is $TERM" 
    endif
