---
layout: post
title: "Removing Ports OS X"
date: 2010-08-17 12:18:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- OS X
discuss_url: //62
url: //62/Removing_Ports_OS_X
id: 62
---
I have previously mentioned I installed [Homebrew][] for installing unix packages, I left Ports in place, but removed from my path, just incase. I have tonight noticed that the Mac ports directory is eating up 1.7GB of space and I want it back.

    $ du -s -h /opt/local/var/macports

Following this [guide to remove ports][rmports] I ran:

    $ sudo /opt/local/bin/port -f uninstall installed
    $ sudo rm -rf \
        /opt/local \
        /Applications/DarwinPorts \
        /Applications/MacPorts \
        /Library/LaunchDaemons/org.macports.* \
        /Library/Receipts/DarwinPorts*.pkg \
        /Library/Receipts/MacPorts*.pkg \
        /Library/StartupItems/DarwinPortsStartup \
        /Library/Tcl/darwinports1.0 \
        /Library/Tcl/macports1.0 \
        ~/.macports

Now After emptying Trash, probably not necessary though, you should see quite a bit of harddrive space freed up.

[Homebrew]: http://amaras-tech.co.uk/people/morgan/article/44
[rmports]: http://guide.macports.org/chunked/installing.macports.uninstalling.html
