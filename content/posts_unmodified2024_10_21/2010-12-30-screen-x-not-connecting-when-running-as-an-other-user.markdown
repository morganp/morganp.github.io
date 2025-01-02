---
layout: post
title: "screen -x not connecting when running as an other user"
date: 2010-12-30 13:06:42 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- OS X
- Screen
discuss_url: //85
url: //85/screen_-x_not_connecting_when_running_as_an_other_user
id: 85
---
I have been running into issues with screen when switching to another user:

    $ su otheruser
    > password
    $ screen -x
    > Cannot open your terminal '/dev/ttys002' - please check.

From [this post][source] I have discovered that it was due to a permissions issue. 

    $ ls -l /dev/ttys002
    > crw--w----  1 user  tty   16,   2 Dec 30 23:34 /dev/ttys002

To fix I had to set other permissions.

    $ su otheruser
    $ sudo chmod go+wr /dev/ttys002

You still have to su to the owners account and therefore it is still secure. ie user can not just connect to a /dev/ttys002 currently in use by otheruser.

     #As user, otheruser currently using /dev/ttys002
     $ screen -x /dev/ttys002
    > Must run suid root for multiuser support. 

The issue has kept recurring and I have had to reset the permissions every time I wanted to connect. This could be Mac OS X specific but I edited the root crontab to fix.

    $ sudo crontab -e
    # Added the text below
    # MIN   HOUR   MDAY  MON  DOW   COMMAND 
      0,15,30,45 * * * * chmod o+wr /dev/ttys000
      0,15,30,45 * * * * chmod o+wr /dev/ttys001
      0,15,30,45 * * * * chmod o+wr /dev/ttys002
      0,15,30,45 * * * * chmod o+wr /dev/ttys003
      0,15,30,45 * * * * chmod o+wr /dev/ttys004
      0,15,30,45 * * * * chmod o+wr /dev/ttys005


[source]: http://www.linuxquestions.org/questions/linux-general-1/problem-using-screen-cannot-open-your-terminal-dev-pts-0-please-check-338313/

