---
layout: post
title: "Ubuntu and the Jetway ADPE4S"
date: 2013-05-02 17:02:37 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Linux
- Ubuntu
discuss_url: //220
url: //220/Ubuntu_and_the_Jetway_ADPE4S
id: 220
---
**Still unresolved**

The Jetway ADPE4S uses a Marvell 88SE6145 chip which a number of users have had trouble getting to work with Linux.

Currently there is [bug report][] open for ubuntu about it.

Also there is a report on the [debian wiki](http://wiki.debian.org/pata_marvell) about fixing it so far I have:

/etc/modprobe.d/my-marvell.conf

    install pata_marvell /bin/true

/etc/modprobe.d/my-marvel.conf //<-- spelling mistake?

    options ahci marvell_enable=1

Run (rebuilds some boot thingy):

    sudo update-initramfs -u




[bug report]: https://bugs.launchpad.net/ubuntu/+source/linux/+bug/1087790
