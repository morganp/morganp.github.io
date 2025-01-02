---
layout: post
title: "Mountain Lion Setup, Part 5 /etc/hosts"
date: 2012-08-30 20:28:12 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Mountain Lion
- Network
discuss_url: //189
url: //189/Mountain_Lion_Setup%2C_Part_5_%2Fetc%2Fhosts
id: 189
---
For ssh and ping to local machines with out the .local extension I added them to my /ets/hosts file.

A normal user does not have permission so you have to use sudo. If you os x account has admin privlages it will prompt you for your password. If you have not used vim before, i for insert mode (like a standard text editor), esc to exit insert mode and :wq to write and quit.

    sudo vim /etc/hosts

    ##
    # Host Database
    #
    # localhost is used to configure the loopback interface
    # when the system is booting.  Do not change this entry.  
    ##
    127.0.0.1	localhost
    255.255.255.255	broadcasthost
    ::1             localhost 
    fe80::1%lo0	localhost
    
    ## Append Local fixed ip Machines
    192.168.10.1   router
    192.168.10.100 macmini
    192.168.10.101 krypton
    192.168.10.250 backup


