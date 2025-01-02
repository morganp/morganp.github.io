---
layout: post
title: "Using ~/.ssh/config and no passowrds with Mac OS X"
date: 2011-07-14 21:56:03 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Command Line
- OS X
discuss_url: //117
url: //117/Using_%7E%2F.ssh%2Fconfig_and_no_passowrds_with_Mac_OS_X
id: 117
---
Using ssh to securely connect with servers from the terminal is pretty easy. set up a public key and a private key using:

    ssh-keygen -t rsa

This should save them in ~/.ssh/

However you may want separate keys for work, for home servers and other services like a web server or github. the ~/.ssh/config file is a way to specify a list of possible keys to use and associate them with a host name. I when using this initially Mac OS X always prompted me for my identity file password. instead of acting password-less.

For OS X it looks like you have to add a few more options to get the same behaviour as without the .ssh/config :

    Host *
      RSAAuthentication yes
      PasswordAuthentication yes
      ChallengeResponseAuthentication no
      IdentityFile ~/.ssh/id_rsa

Adding more Identity files the first passing will be used

    Host *
      RSAAuthentication yes
      PasswordAuthentication yes
      ChallengeResponseAuthentication no
      IdentityFile ~/.ssh/id_rsa
      IdentityFile ~/.ssh/id_rsa_work
      IdentityFile ~/.ssh/id_rsa_github

Multiple Identities, using known identity for known location.

    Host *.work.com
      IdentityFile ~/.ssh/id_rsa

    Host *.github.com
      IdentityFile ~/.ssh/id_rsa_github

    Host *
      RSAAuthentication yes
      PasswordAuthentication yes
      ChallengeResponseAuthentication no
      IdentityFile ~/.ssh/id_rsa

For more info try looking at [the man page][man], from your terminal:

    $ man ssh_config

[man]: http://www.openbsd.org/cgi-bin/man.cgi?query=ssh_config
