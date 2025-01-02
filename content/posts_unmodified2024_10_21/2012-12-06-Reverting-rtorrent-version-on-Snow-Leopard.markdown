---
layout: post
title: "Reverting rtorrent version on Snow Leopard"
date: 2012-12-06 20:22:33 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- BitTorrent
- Leopard
- Snow Leopard
- OS X
- rtorrent
- Homebrew
discuss_url: //206
url: //206/Reverting_rtorrent_version_on_Snow_Leopard
id: 206
---
After running  a `brew upgrade` rtorrent was plagued with segmentation faults. Which look something like :

    Caught Segmentation fault, dumping stack:B] [Port: 16006]                                                                    [U 0/14]    [D 0/30] [H 28/32] [S 196/198/208] [F 15/16]
    0 0   rtorrent                            0x0000000100001c8c _Z8do_panici + 130
    1 1   rtorrent                            0x0000000100044d48 _ZN13SignalHandler6caughtEi + 234
    2 2   libSystem.B.dylib                   0x00007fff872b51ba _sigtramp + 26
    3 3   libcrypto.0.9.8.dylib               0x00007fff81414491 ERR_get_state + 65
    4 4   libtorrent.14.dylib                 0x00000001002a75a9 _ZN7torrent13DiffieHellman13store_pub_keyEPhj + 45
    5 5   libtorrent.14.dylib                 0x0000000100292fb0 _ZN7torrent9Handshake20prepare_key_plus_padEv + 74
    6 6   libtorrent.14.dylib                 0x00000001002932ac _ZN7torrent9Handshake11event_writeEv + 284
    7 7   libtorrent.14.dylib                 0x0000000100247322 _ZN7torrent10PollKQueue7performEv + 236
    8 8   libtorrent.14.dylib                 0x0000000100247d69 _ZN7torrent10PollKQueue7do_pollExi + 383
    9 9   libtorrent.14.dylib                 0x000000010026b608 _ZN7torrent11thread_base10event_loopEPS0_ + 330
    10 10  rtorrent                            0x0000000100005af4 main + 12976
    11 11  rtorrent                            0x0000000100001820 start + 52
    12 12  ???                                 0x0000000000000001 0x0 + 1
    Abort trap

Since mid 2011 brew has added a versions command. Lets check what versions are available:

    $ brew versions rtorrent
    0.9.2 git checkout 6b8d25f /usr/local/Library/Formula/rtorrent.rb
    0.8.9 git checkout e459d51 /usr/local/Library/Formula/rtorrent.rb
    0.9.0 git checkout 9b5cba7 /usr/local/Library/Formula/rtorrent.rb
    0.8.6 git checkout b782d9d /usr/local/Library/Formula/rtorrent.rb
    0.8.5 git checkout b92799d /usr/local/Library/Formula/rtorrent.rb
    
    $ brew versions libtorrent
    0.13.2 git checkout 8d5b242 /usr/local/Library/Formula/libtorrent.rb
    0.12.9 git checkout edd213c /usr/local/Library/Formula/libtorrent.rb
    0.13.0 git checkout 130b408 /usr/local/Library/Formula/libtorrent.rb
    0.12.6 git checkout 0476235 /usr/local/Library/Formula/libtorrent.rb
    0.12.5 git checkout d0ec1e6 /usr/local/Library/Formula/libtorrent.rb

The version giving me the segmentation faults is 0.9.2 with libtorrent 0.13.2, lets roll back to the previous version 0.8.9/0.12.9.

    brew uninstall rtorrent libtorrent
    cd /usr/local/Library/Formula/
    git checkout edd213c
    # Not sure why brew thinks these are installed again but I had to run
    brew uninstall rtorrent libtorrent 
    brew install rtorrent libtorrent 

Once that has completed rtorrent should run as 0.8.9/0.12.9, which seems a whole lot more reliable on a mid 2010 Mac mini running snow leopard.
