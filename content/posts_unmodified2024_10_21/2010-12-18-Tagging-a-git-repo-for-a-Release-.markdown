---
layout: post
title: "Tagging a git repo for a Release "
date: 2010-12-18 04:07:46 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Git
- Programming
discuss_url: //83
url: //83/Tagging_a_git_repo_for_a_Release_
id: 83
---
I think it is good practise to create a read only tag when releasing an application. This allows you to create a branch from it at any time or a bug fix with out worrying about accidentally mixing in new features from your latest code base. 

Git Tagging
===========

Lists current tags:

    $ git tag 
    
Create tag named gem-0.1.0, code to match the gem 0.1.0 release.

    $ git tag gem-0.1.0 

Push named tag to the remote repo:

    $ git push origin gem-0.1.0

Push all tags to repo:

    $ git push --tags


A very good book covering topics like this and many others [Pragmatic Guide to Git ][prag-git].

[prag-git]: https://www.amazon.co.uk/dp/1934356727?tag=morgue-21&camp=2902&creative=19466&linkCode=as4&creativeASIN=1934356727&adid=0C6PBKZXSP31YKZF8BFS&
