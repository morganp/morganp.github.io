---
layout: post
title: "Tagging a git repo and pushing tag to github"
date: 2011-10-25 21:46:13 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Gem
- Git
- Programming
- Ruby
discuss_url: //127
url: //127/Tagging_a_git_repo_and_pushing_tag_to_github
id: 127
---
This assumes that `origin` is the label for github.   
Tagging a github repo for my gem releases I do:

    $ git tag -a 0.0.4 -m 'Tagging gem release 0.0.4'
    $ git push origin 0.0.4
