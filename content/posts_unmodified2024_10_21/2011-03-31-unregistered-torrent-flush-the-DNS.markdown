---
layout: post
title: "'unregistered torrent' flush the DNS"
date: 2011-03-31 10:45:20 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- BitTorrent
- Command Line
discuss_url: //96
url: //96/%27unregistered_torrent%27_flush_the_DNS
id: 96
---
If a torrent application has been running and torrents start showing a status of 'unregistered torrent' a likely cause is that the server IP address has changed. To fix this you need to close the application and flush the DNS, before starting the application again.

To flush the DNS cache:

OS X Leopard / Snow Leopard
---------------------------

    $ sudo dscacheutil -flushcache

Windows XP
----------

    $ lookupd -flushcache
