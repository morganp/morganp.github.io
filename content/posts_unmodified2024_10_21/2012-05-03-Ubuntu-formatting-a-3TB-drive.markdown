---
layout: post
title: "Ubuntu, formatting a 3TB drive"
date: 2012-05-03 21:34:20 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Linux
- Memory
- Ubuntu
discuss_url: //158
url: //158/Ubuntu%2C_formatting_a_3TB_drive
id: 158
---
I started off following [the ubuntu guide for installing a new drive][ubuntu], which uses fdsik to create the partitions how ever after formatting and mounting I ran `df -h`:

    Filesystem      Size  Used Avail Use% Mounted on
    /dev/sdb1       2.0T   28G  1.9T   2% /mnt/kryten/disk5

Which is not 3TB
--

I then found [this article][correct] which worked in the long run not sure if I typo'd a command but similar to [this other user][other] I had to run through the commands a second time for them to work.

To start with use `parted` instead of fdisk, this allows the gpt partition table that fdisk does not.

    (parted) mklabel gpt 
    Warning: The existing disk label on /dev/sdb will be destroyed and all data on
    this disk will be lost. Do you want to continue?
    Yes/No? yes    
    (parted) unit TB 
    (parted) mkpart primary 0.00TB 3.00TB                                     
    Warning: You requested a partition from 0.00TB to 3.00TB.                 
    The closest location we can manage is 0.00TB to 0.00TB.
    Is this still acceptable to you?
    Yes/No? yes
    
basically after this point it showed up as a few KB after formatting, tried it again and it seemed to work much better.

    (parted) mklabel gpt                                                       
    Warning: The existing disk label on /dev/sdb will be destroyed and all data on
    this disk will be lost. Do you want to continue?
    Yes/No? yes                                                               
    (parted) unit TB                                                          
    (parted) mkpart primary 0.00TB 3.00TB                                     
    (parted) print                                                            
    odel: Unknown (unknown)
    Disk /dev/sdb1: 3001GB
    Sector size (logical/physical): 512B/4096B
    Partition Table: loop

    Number  Start   End     Size    File system  Name     Flags
    1      0.00TB  3.00TB  3.00TB               primary
    
    (parted) quit                                                             
    Information: You may need to update /etc/fstab.                           


Format
--

    $ sudo mkfs.ext4 /dev/sdb1
    $sudo parted /dev/sdb1
    (parted) print
    Model: Unknown (unknown)
    Disk /dev/sdb1: 3001GB 
    Sector size (logical/physical): 512B/4096B
    Partition Table: loop
    
    Number  Start  End     Size    File system  Flags
    1      0.00B  3001GB  3001GB  ext4

Reduce Reserved Space
---

By default 5% is reserved for the root to stop the driving becoming unusable when full, for data and not the main OS drive this does not matter too much, and 5% was decided when drives where much small. 5% of 3TB is 150 GB, way too much.  Turn this down to 1% with:

    sudo tune2fs -m 1 /dev/sdb1

Mount 
--

    sudo mkdir /mnt/kryten/disk5 
    sudo mount /dev/sdb1 /mnt/kryten/disk5

Find UUID
--

    $ sudo blkid
    /dev/sda1: UUID="c41cba49-bd3a-41d7-961c-b4ad45d48ed1" TYPE="ext4" 
    /dev/sdb1: UUID="d822c6af-9802-4d00-8de8-61f1653a854a" TYPE="ext4" 
    /dev/sdc1: UUID="59a61ceb-fee3-460a-97c5-e9f115776daf" TYPE="ext4" 
    /dev/sdc5: UUID="80f9c384-9a5a-4563-921a-5c25628e1b2e" TYPE="swap"

Update /etc/fstab 
--

    $sudo vim /etc/fstab

    #/dev/sdb1 3TB drive replacing 1.5TB old UUID Below
    UUID=d822c6af-9802-4d00-8de8-61f1653a854a     /mnt/kryten/disk4 ext4 rw,auto,user,exec,async,errors=remount-ro 0 1
    #UUID=c41cba49-bd3a-41d7-961c-b4ad45d48ed1    /mnt/kryten/disk4 ext4 rw,auto,user,exec,async,errors=remount-ro 0 1

[ubuntu]: https://help.ubuntu.com/community/InstallingANewHardDrive
[correct]: http://www.cyberciti.biz/tips/fdisk-unable-to-create-partition-greater-2tb.html
[other]: http://archlinuxarm.org/forum/viewtopic.php?t=1935&p=10490
