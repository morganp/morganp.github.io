---
layout: post
title: "Adding USB drives to a headless Ubuntu Linux box"
date: 2010-07-17 04:03:10 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Linux
- Ubuntu
discuss_url: //54
url: //54/Adding_USB_drives_to_a_headless_Ubuntu_Linux_box
id: 54
---
After adding some USB2 (NTFS formatted) drives to a headless Ubuntu server, they were not auto-mounted so I had to find them and mount them, with only remote terminal access.

List Hard Drive Devices:

    sudo fdisk -l

Create a mount point:

    sudo mkdir /mnt/starbug1/terra06

and run this command to mount (NTFS formatted):

    sudo mount /dev/sdc1 /mnt/starbug1/terra06 -t ntfs


