---
layout: post
title: "My Backup Strategy"
date: 2011-01-18 10:25:12 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Command Line
- Linux
- OS X
- Performance
- Ubuntu
discuss_url: //86
url: //86/My_Backup_Strategy
id: 86
---
Considering various raid strategies I decided that Raid 5 would be too limiting and have previously found raid striping systems to be too unreliable. I decided to have a bunch of disks (JBOD if you will) directly connected to a machine. At some point in the future I would like a merged view of the drives, potentially through a fuse file system or a soft linking script.

To protect against hardware failures, firmware updates etc I back up to a server running a different OS, instead of any raid mirroring. My mac mini backups to a headless Ubunutu. This has a power advantage that the backup drives are powered down most of the time.

Whenever I add a drive to the main server I add at least the same size to the backup server. I then run rsync to back each drive up. 

    $ REMOTE_IP=192.168.0.2
    $ rsync -av --ignore-errors --delete --exclude '.Trashes' --exclude '.Spotlight-V100' --exclude '.DS_Store' /Volumes/Drive1/ $REMOTE_IP:/mnt/backup/drive1/

For some reason once it was scripted up it stopped deleting files from the backup drive adding the '--ignore-errors' fixed this issue.

The other small gotcha that I ran into was that by default ext3 drives reserve 5% of the space for root. This is so that the main drive does not get so full it stops to function correctly and root can not get in to fix things. I am not sure how useful it is on non-root drives. This had the consequence that when backing up a nearly full drive it would not fit in to the back up drive. NB: 5% of a 2TB drive is 100GB, which is quite a lot of space.

To reset the amount of reserved space I used (for 0%):

    $ sudo tune2fs -m 0 /dev/sda1

My full backup script

    #!/bin/bash
    ARCHIVE_SERVER="192.168.0.2"

    disk[0]="/Volumes/disk1/ $ARCHIVE_SERVER:/mnt/archive_server/disk1/"
    disk[1]="/Volumes/disk2/ $ARCHIVE_SERVER:/mnt/archive_server/disk2/"
    disk[2]="/Volumes/disk3/ $ARCHIVE_SERVER:/mnt/archive_server/disk3/"
   
    for backup in "${disk[@]}"
    do
      #Split in to $1 and $2
      set -- $backup
      if [ -d $1 ]
      then 
        rsync -av --ignore-errors --delete --exclude '.Trashes'   \
    --exclude '.Spotlight-V100' --exclude '.DS_Store' $1 $2
      else
        echo "Drive offline $1 (Not Backed Up)"
      fi
    done

