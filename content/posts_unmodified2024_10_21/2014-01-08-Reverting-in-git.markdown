---
layout: post
title: "Reverting in git"
date: 2014-01-08 20:10:31 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Git
discuss_url: //248
url: //248/Reverting_in_git
id: 248
---
I use to use `svn revert` to roll back local modification and get back to the state I was in last time I checked out.

to do the same in git  I use : 

    git checkout -- filename

As git does not automatically push to a server the way subversion does you have an opportunity to revert local commits.

    git reset --soft HEAD^


Here the `^` means previous. ie go back 1 commit. Using soft the files will still appear modified and we can use the previous command to reset the files as required.


Further reading [what “git reset” does in plain english?](http://stackoverflow.com/q/2530060/97073), [Visual Git Reference](http://marklodato.github.io/visual-git-guide/index-en.html) and [Reset Demystified](http://git-scm.com/blog/2011/07/11/reset.html)


--
[git checkout source](http://www.norbauer.com/rails-consulting/notes/git-revert-reset-a-single-file.html).    
[git reset source](http://stackoverflow.com/questions/2845731/how-to-uncommit-my-last-commit-in-git).  
