---
layout: post
title: "rtorrent move on download completion"
date: 2014-01-08 19:53:02 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- rtorrent
- Programming
discuss_url: //247
url: //247/rtorrent_move_on_download_completion
id: 247
---
rtorrent moving torrents upon completion:

    # Torrents go in ~/Torrents
    # Incomplete Downloads in ~/Incomplete
    # Upon Completion Data is moved to ~/Seeding

    schedule = watch_directory_standard,10,10,"load_start=~/Torrents/*.torrent,d.set_directory=~/Incomplete/,d.set_custom1=~/Seeding/

    #Move upon download completion.
    system.method.set_key =event.download.finished,move_complete,"d.set_directory=$d.get_custom1= ;execute=mv,-n,$d.get_base_path=,$d.get_custom1="

[Link to gist on github](https://gist.github.com/morganp/8323448).  

[Recipe](http://libtorrent.rakshasa.no/wiki/RTorrentCommonTasks#Movecompletedtorrentstodifferentdirectorydependingonwatchdirectory).
