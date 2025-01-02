---
layout: post
title: "SVN multi-line comments on the command line "
date: 2012-03-28 13:32:53 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Automation
- Subversion
discuss_url: //141
url: //141/SVN_multi-line_comments_on_the_command_line_
id: 141
---
Answer:

    svn commit -m $'Line 1 \nLine 2'

The Problem
-----------

Committing to subversion on the command line and using escaped line returns for multi line comments:

    svn commit -m $'Line 1 \nLine 2'

svn log will show some thing like 

    ------------------------------------------------------------------------
    r1 | user | 2012-03-28 13:37:48 +0100 (Wed, 28 Mar 2012) | 1 lines

    Line 1 \nLine 2

Answer originally posted on [ServerFault][source]. Strings contained in \'\' should not be interpreted by the command line but:

    svn commit -m "Line 1 \nLine 2"

Shows the same errors. Starting the comment with a $ does seem to fix it.

    svn commit -m $'Line 1 \nLine 2'
   
Will give:

    ------------------------------------------------------------------------
    r1 | user | 2012-03-28 13:37:48 +0100 (Wed, 28 Mar 2012) | 1 lines

    Line 1 
    Line 2

[source]: http://serverfault.com/questions/148917/use-linefeed-or-carriage-return-in-subversion-commit-message-from-the-command-li
