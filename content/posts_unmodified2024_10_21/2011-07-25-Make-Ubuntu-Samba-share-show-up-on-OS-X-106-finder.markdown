---
layout: post
title: "Make Ubuntu Samba share show up on OS X 10.6 finder"
date: 2011-07-25 20:35:18 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Linux
- Ubuntu
discuss_url: //120
url: //120/Make_Ubuntu_Samba_share_show_up_on_OS_X_10.6_finder
id: 120
---
Install Avahi, it like bonjour auto discovery but for linux, then tell it about your servers samba service.

    $ sudo apt-get install avahi-daemon
    $ cd /etc/avahi/services/
    $ sudo wget https://raw.github.com/gist/1105096/0dc157711a85a08a1220ecb3fe94f069d2fcecec/etc_avahi_services_samba.service
    $ sudo mv etc_avahi_services_samba.service samba.service
    $ sudo restart avahi-daemon
