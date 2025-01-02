---
layout: post
title: "Ubuntu (Linux) List Disks"
date: 2013-05-02 13:39:24 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Linux
- Ubuntu
discuss_url: //219
url: //219/Ubuntu_%28Linux%29_List_Disks
id: 219
---
    sudo lshw -class disk -class storage -short

Outputs :

    H/W path           Device     Class       Description
    =====================================================
    /0/100/1c.3/0      scsi0      storage     JMB363 SATA/IDE Controller
    /0/100/1c.3/0/0    /dev/sda   disk        3TB ST3000DM001-9YN1
    /0/100/1c.3/0/1    /dev/sdb   disk        2TB SAMSUNG HD204UI
    /0/100/1c.3/0.1               storage     JMB368 IDE controller
    /0/100/1f.2        scsi2      storage     N10/ICH7 Family SATA Controller [IDE mode]
    /0/100/1f.2/0      /dev/sdc   disk        3TB ST3000DM001-9YN1
    /0/100/1f.2/1      /dev/sdd   disk        2TB SAMSUNG HD204UI
    /0/1               scsi6      storage
    /0/1/0.0.0         /dev/sde   disk        8019MB SCSI Disk
