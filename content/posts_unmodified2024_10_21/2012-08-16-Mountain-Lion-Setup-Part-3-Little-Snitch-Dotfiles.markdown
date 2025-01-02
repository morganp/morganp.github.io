---
layout: post
title: "Mountain Lion Setup, Part 3 : Little Snitch & Dotfiles"
date: 2012-08-16 12:44:04 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Mountain Lion
discuss_url: //183
url: //183/Mountain_Lion_Setup%2C_Part_3_%3A_Little_Snitch_%26_Dotfiles
id: 183
---
Little Snitch
--

There is currently a preview (Beta) of [Little Snitch 3][littelsnitch3]. If you have not come across Little Snitch before it is a Third Party Firewall for OS X. When an application tries to make a network connection (connecting to the internet) it allerts you and allows the application to be blocked. Controllability is based on the application, the place it is connecting to and the port that it is connecting on. 

From Version 3 of Little Snitch we also get control of incoming connections. Version 3 is a free preview until September 15, 2012.

Installation of Little Snitch requires a restart.

[littlesnitch3]: http://www.obdev.at/products/littlesnitch/download.html

Dotfiles
--
For last few years I have ket [my dotfiles][dotfiles] (configuration files) on [github][].

First create a new set of RSA keys (if on a new machine) from `/Applications/Utilities/Terminal.app`:

    ssh-keygen -t rsa
    cat ~/.ssh/id_rsa.pub

Then copy this output and add it to your [github ssh keys][keys].

if git is not installed `brew install git`

    #Configure Git Globals
    git config --global user.name "Your Name"
    git config --global user.name your@email.com
    # Get Dotfiles Repo
    cd ~
    git clone git@github.com:morganp/dotfiles.git

Add ssh to Little Snitch, Forever, Any Connection, Allow.

Once the cloning of the repo has completed, I go into my dotfiles folder and run the installer.

    cd ~/dotfiles 
    ./install --all

There are 2 types of bash config, .bashrc and .bash_login.

For consistency I change the .bash_login to just load the .bashrc

    if [ -f $HOME/.bashrc ]; 
    then
      source $HOME/.bashrc ; 
    fi

This may alter some of the things that RVM has put in place my github dotfiles include this but you need to make sure that included in your .basrc is :

    [[ -s "$HOME/.rvm/scripts/rvm" ]] && source "$HOME/.rvm/scripts/rvm" # Load RVM into a shell session *as a function*
    PATH=$PATH:$HOME/.rvm/bin # Add RVM to PATH for scripting

Lets also install Mac VIM for good measure:

    brew install macvim
 
Adding Curl to Little Snitch, Forever, Any Connection, Allow.
   

[dotfiels]: https://github.com/morganp/dotfiles
[github]: https://github.com/
[keys]: https://github.com/settings/ssh
