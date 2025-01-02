---
layout: post
title: "Homebrew package management for Mac OS X"
date: 2010-06-22 07:45:14 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- OS X
- Performance
- Command Line
discuss_url: //44
url: //44/Homebrew_package_management_for_Mac_OS_X
id: 44
---
Homebrew is a new package management system for Mac OS X. [A good review/tutorial on EngineYard][homebrew_tut].

Update 20-August-2010  
Then method of installation below adds lots (4) extra folders to your home area making it look clutered so I now preffer this method of installation.

    ruby -e "$(curl -fsS http://gist.github.com/raw/323731/install_homebrew.rb)";

Then just make sure '/usr/local/bin/' and '/usr/local/sbin/' are on your path.  
Update End

Although I do not like the idea of changing permissions on /usr/local/, so I did:

    mkdir -p ~/bin/homebrew
    curl -L http://github.com/mxcl/homebrew/tarball/master | tar xz --strip 1 -C ~/bin/homebrew
    ln -s ~/bin/homebrew/bin/brew ~/bin/brew

    #and make sure ~/bin is on your path with soem thing like this in your ~/.bashrc
    # export PATH=$PATH:~/bin

Now try it out:
 
    $ brew --version
    > 0.6
    $ brew install wget
    Warning: It appears you have Macports or Fink installed
    Although, unlikely, this can break builds or cause obscure runtime issues.
    If you experience problems try uninstalling these tools.
    ==> Downloading http://ftp.gnu.org/gnu/wget/wget-1.12.tar.bz2
    ######################################################################## 100.0%
    ==> ./configure --disable-debug --prefix=/Users/morgy/bin/homebrew/Cellar/wget/1.12 --disable-iri
    ==> make install
    /Users/morgy/bin/homebrew/Cellar/wget/1.12: 7 files, 576K, built in 44 seconds

Done
    
[homebrew_tut]: http://www.engineyard.com/blog/2010/homebrew-os-xs-missing-package-manager/
