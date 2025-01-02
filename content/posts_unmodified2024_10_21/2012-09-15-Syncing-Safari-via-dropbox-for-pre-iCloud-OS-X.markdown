---
layout: post
title: "Syncing Safari via dropbox for pre iCloud OS X"
date: 2012-09-15 18:39:27 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Safari
- Web
discuss_url: //193
url: //193/Syncing_Safari_via_dropbox_for_pre_iCloud_OS_X
id: 193
---
*THIS NO LONGER WORKS, IF IT EVER DID :(*

When you add a link to safari, it replaces the link to dropbox with an actual file, outside of dropbox so breaks the syncing.

The Original Syncing Idea was :
--

For the cloud storage we will use [dropbox][dropboxref], if you have not already got an account you can get a free on [here][dropboxref].

Once setup only the bookmarks from the first machine will be available after that bookmarks should be kept in sync.

Create a backup of the original file then copy to dropbox, then create a link back to the original location. Todo this from `/Application/Utitlities/Terminal.app` run these commands:

    cp ~/Library/Safari/Bookmarks.plist ~/Library/Safari/Bookmarks.plist.backup
    mv ~/Library/Safari/Bookmarks.plist ~/Dropbox
    ln -s ~/Dropbox/Bookmarks.plist ~/Library/Safari/Bookmarks.plist

On secondary machines, which will initially only have the first computers bookmarks.

    mv ~/Library/Safari/Bookmarks.plist ~/Library/Safari/Bookmarks.plist.backup
    ln -s ~/Dropbox/Bookmarks.plist ~/Library/Safari/Bookmarks.plist

Original ideas is from [here][source]

[dropboxref]:  http://db.tt/ZZzJ5LBq
[source]: http://macs.about.com/od/CloudServices/qt/Sync-Safari-Bookmarks-Using-Dropbox.htm
    
