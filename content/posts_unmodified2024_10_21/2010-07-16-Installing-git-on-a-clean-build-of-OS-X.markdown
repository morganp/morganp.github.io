---
layout: post
title: "Installing git on a clean build of OS X"
date: 2010-07-16 11:44:11 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Git
- OS X
- Programming
discuss_url: //53
url: //53/Installing_git_on_a_clean_build_of_OS_X
id: 53
---
Having a clean build of Mac OS X Snow Leopard I thought I would give the [Homebrew][] method of installing git a try.

First of all Install [Homebrew][]. I did it by executing:

    ruby -e "$(curl -fsS http://gist.github.com/raw/323731/install_homebrew.rb)"

This does some commands as sudo but we trust Homebrew right?  
NB: Since Leopard sudo will require a password if you do not have a password set it will not except empty or no password so you must have a password set for your user account.

Then install [Xcode][]. 3.2.3 was the latest when writing this but came with the iphone 4 sdk (~2GB) I chose to go with the slightly older 3.2.2 at ~750MB.

Last [install git via Homebrew][git]:

    brew install git
    ==> Downloading http://kernel.org/pub/software/scm/git/git-1.7.1.1.tar.bz2
    ######################################################################## 100.0%
    ==> make prefix=/usr/local/Cellar/git/1.7.1.1 install
    ==> Downloading http://kernel.org/pub/software/scm/git/git-manpages-1.7.1.1.tar.bz2
    ######################################################################## 100.0%
    ==> Downloading http://kernel.org/pub/software/scm/git/git-htmldocs-1.7.1.1.tar.bz2
    ######################################################################## 100.0%
    /usr/local/Cellar/git/1.7.1.1: 916 files, 18M, built in 82 seconds

    git --version
    > git version 1.7.1.1
 
[Homebrew]: http://github.com/mxcl/homebrew
[Xcode]: http://developer.apple.com/technologies/xcode.html
[git]: http://help.github.com/mac-git-installation/
