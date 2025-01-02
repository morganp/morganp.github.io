---
layout: post
title: "Home Directory File Structure"
date: 2015-10-22 10:32:44 +0100
comments: true
sharing: true
footer: true
Category: Tech
Tags: Filesystem, Organised
---

Apples default directory structure is :

    /Users/username
    ├── Desktop
    ├── Documents
    ├── Downloads
    ├── Library   # Hidden by default
    ├── Movies
    ├── Music
    ├── Pictures
    ├── Public
   
My current setup After adding Dropbox, dotfiles stored on github, Code, and user level applications folder:

    /Users/username
    ├── Applications
    ├── Code
    ├── Desktop
    ├── Documents
    ├── Downloads
    ├── Dropbox
    ├── Library
    ├── Movies
    ├── Music
    ├── Pictures
    ├── Public
    ├── dotfiles

At present though my Dropbox is a mess of some documents, some code and lots of ebooks. Free Dropbox does not have enough space for me to the entire home directory. Considering a BtSync pro account which allows selective sync. BtSync will allow me to set the root as my home directory and select which folders from that to sync. 

I have started using USB flash drives again, and have found [unison](http://www.cis.upenn.edu/~bcpierce/unison) to be a useful tool for syncing local drives to each other.

Me example unison sync (USB drive is called 'Dropbox'):

    unison ~/ /Volumes/Dropbox/Unison/ -fat -auto -links true \
    -path Code      \
    -path Documents \
    -path Dropbox 

    #-fat Work With FAT filesystem (ThumbDrive)
    #-auto Accept default action for non-merges
    #-links true follow symlinks 

Now that the 'Dropbox' root is my home directory I can reorganise. Books should become a top level folder, and share a place along side Music and Movies.

Dropbox is kept but mainly used for sharing temporary files with others.

    /Users/username
    ├── Applications
    ├── Books
    ├── Code
    ├── Desktop
    ├── Documents
    ├── Downloads
    ├── Dropbox
    ├── Library
    ├── Movies
    ├── Music
    ├── Pictures
    ├── Public
    ├── dotfiles


Dropbox: sending large files
BT Sync: Synchronising files (eBook collection)
Unison: Synchronising local drives (Thumbdrive to local documents/ebooks)
ReadyNAS: Remote access to larger volume drives (Movies and TV Collections)
 Above could be a BT Sync non populated folder  

