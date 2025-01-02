---
layout: post
title: "Ruby parsing torrent files for meta info"
date: 2010-06-04 10:03:26 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Performance
- Ruby
- BitTorrent
discuss_url: //36
url: //36/Ruby_parsing_torrent_files_for_meta_info
id: 36
---
There currently does not appear to be any really good torrent file parsers available via the gems system.

rubytorrent seems good at first glance but requires some maintenance to handle udp trackers, which has been done by [dydx][dydx_prof] available on [github][RubyTorrent]. As I cloned the repo rather than install it via gems the requires do not work properly so I have [cloned it][RubyTorrentMP] and modified the way it requires files.

Other torrent parsers available are aversa and Bencoding.
Bencoding was originally [found here][Bencoding] but I have modified it a little bit to make it more user friendly [here][BencodingMP] and an example of how to use it [here][BencodingMPexam].

A quick Review of Performance (parsing a handful of torrent files)  
Bencoding Execution time 96.626849 seconds  
Aversa Execution time 10.573079 seconds  
RubyTorrent Execution time 0.689869 seconds  



[dydx_prof]: http://github.com/dydx
[RubyTorrent]: http://github.com/dydx/RubyTorrent
[RubyTorrentMP]: http://github.com/morganp/RubyTorrent
[Bencoding]: http://robwilliams.me/2009/10/week-6-october-6-2009-torrent-parser/
[BencodingMP]: http://github.com/morganp/scripts_generic/blob/master/bencoding.rb
[BencodingMPexam]: http://github.com/morganp/scripts_generic/blob/master/torrent_info.rb
