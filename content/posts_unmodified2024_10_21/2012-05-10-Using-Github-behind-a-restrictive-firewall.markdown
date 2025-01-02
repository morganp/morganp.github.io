---
layout: post
title: "Using Github behind a restrictive firewall"
date: 2012-05-10 20:24:08 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Git
- Programming
discuss_url: //159
url: //159/Using_Github_behind_a_restrictive_firewall
id: 159
---
When working behind a restrictive firewall, which limits ssh connections you may be running into some of the following errors:

Connection refused
--

    git clone git@github.com:morganp/maruku_snippet.git
    Cloning into maruku_snippet...
    ssh: connect to host github.com port 22: Connection refused
    fatal: The remote end hung up unexpectedly

Bad Owner, Using .ssh/config
--
 
    git clone git@github.com:morganp/maruku_snippet.git
    Cloning into maruku_snippet...
    Bad owner or permissions on /users/mprior/.ssh/config
    fatal: The remote end hung up unexpectedly

Not a Repository
--
 
    $ git pull https://morganp@github.com/morganp/maruku_snippet.git
    fatal: Not a git repository (or any parent up to mount parent /users)
    Stopping at filesystem boundary (GIT_DISCOVERY_ACROSS_FILESYSTEM not set).

RPC failed
--

    $ git clone https://morganp@github.com/morganp/maruku_snippet.git
    Cloning into maruku_snippet...
    error: RPC failed; result=22, HTTP code = 405
    fatal: The remote end hung up unexpectedly


Getting it Working
--

Last time I ran into these issues I found I could clone as guest, changed morganp@github.com to just github.com. Pushing will then prompt for your github Username and password. Once cloned you can manually update the config file so you do not have to enter your username. Entering your password will still be required.

    $ git clone https://github.com/morganp/maruku_snippet.git
    Cloning into maruku_snippet...
    remote: Counting objects: 52, done.
    remote: Compressing objects: 100% (38/38), done.
    remote: Total 52 (delta 15), reused 43 (delta 10)
     Unpacking objects: 100% (52/52), done.

Modify .git/config back to :

    url = https://morganp@github.com/morganp/maruku_snippet.git

`git push` will prompt for password via dialog box.
