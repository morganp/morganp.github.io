---
layout: post
title: "Mountain Lion Setup, Part 2 Homebrew & RVM"
date: 2012-08-16 11:34:57 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Homebrew
- Mountain Lion
- Ruby
- RVM
discuss_url: //182
url: //182/Mountain_Lion_Setup%2C_Part_2_Homebrew_%26_RVM
id: 182
---
Following on from [Macbook Pro Setup][setup1], Now it is time to install some of the command line tools.

I have install XCode 4.4 and the command line tools, this allows brew to compile code, the compiler will then get replaced using homebrew to allow ruby compilation.

Alternatively install [osx-gcc-installer][] instead of XCode to get home brew running.

[Homebrew][]
--

From `/Applications/Utilities/Terminal.app`

    $ ruby <(curl -fsSkL raw.github.com/mxcl/homebrew/go)

Which should run a look some thing like:

    ==> This script will install:
    /usr/local/bin/brew
    /usr/local/Library/Formula/...
    /usr/local/Library/Homebrew/...
    /usr/local/share/man/man1/brew.1
    
    Press enter to continue
    ==> /usr/bin/sudo /bin/mkdir /usr/local
    Password:
    ==> /usr/bin/sudo /bin/chmod g+rwx /usr/local
    ==> /usr/bin/sudo /usr/bin/chgrp admin /usr/local
    ==> Downloading and Installing Homebrew...
    remote: Counting objects: 76442, done.
    remote: Compressing objects: 100% (36866/36866), done.
    remote: Total 76442 (delta 52004), reused 60755 (delta 38765)
    Receiving objects: 100% (76442/76442), 10.90 MiB | 1.02 MiB/s, done.
    Resolving deltas: 100% (52004/52004), done.
    From https://github.com/mxcl/homebrew
     * branch            master     -> FETCH_HEAD
    ==> Installation successful!
    You should run `brew doctor' *before* you install anything.
    Now type: brew help

Run :

    $ brew doctor
    > Your system is raring to brew

Test Brew by installing [wget][]:

    $ brew install wget
    ==> Downloading http://ftpmirror.gnu.org/wget/wget-1.14.tar.gz
    ######################################################################## 100.0%
    ==> ./configure --disable-debug --prefix=/usr/local/Cellar/wget/1.14 --sysconfdir=/usr
    ==> make install
    /usr/local/Cellar/wget/1.14: 7 files, 676K, built in 39 seconds

[RVM][]
--
  
We need to update the compiler to a gcc compatible with ruby as XCode4.2+ does not play well with others.

    brew update
    brew install libksba
    brew tap homebrew/dupes
    brew install autoconf automake apple-gcc42
    rvm pkg install openssl


List available Rubies

    rvm list known

Install 1.9.3 head

    rvm install 1.9.3

Make ruby 1.9.3 the default

    rvm use 1.9.3 --default

Clean up brew and rvm (Remove temp files and source code used to compile executables)

    brew cleanup -s
    rm -rf `brew --cache`
    rvm cleanup all

    


[wget]: http://en.wikipedia.org/wiki/Wget
[setup1]: http://amaras-tech.co.uk/article/180
[Homebrew]: http://mxcl.github.com/homebrew/
[RVM]: https://rvm.io/rvm/install/
[osx-gcc-installer]: https://github.com/kennethreitz/osx-gcc-installer/
