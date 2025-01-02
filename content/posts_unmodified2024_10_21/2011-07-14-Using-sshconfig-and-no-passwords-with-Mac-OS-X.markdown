---
layout: post
title: "Using ~/.ssh/config and no passwords with Mac OS X"
date: 2011-07-14 21:55:31 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
discuss_url: //116
url: //116/Using_%7E%2F.ssh%2Fconfig_and_no_passwords_with_Mac_OS_X
id: 116
---
Using ssh to securely connect with servers from the terminal is pretty easy. set up a public key and a private key using

    

However you may want separate keys for work, for home servers and other services like a webserver or github. the ~/.ssh /config file is a way to specify a list of possible keys to use and associate them with a host name. I when using this initially Mac OS X always prompted me for my identity file password. instead of acting password-less.

For OS X it looks like you have to add a few more options to get the same behaviour as without the .ssh/config :

    Host *
      RSAAuthentication yes
      PasswordAuthentication yes
      IdentityFile ~/.ssh/id_rsa

Adding more Identity files the first passing will be used

    Host *
      RSAAuthentication yes
      PasswordAuthentication yes
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
      IdentityFile ~/.ssh/id_rsa
