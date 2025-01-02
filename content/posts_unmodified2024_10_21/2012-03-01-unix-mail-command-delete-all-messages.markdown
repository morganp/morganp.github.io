---
layout: post
title: "unix mail command, delete all messages"
date: 2012-03-01 20:44:36 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- Linux
discuss_url: //140
url: //140/unix_mail_command%2C_delete_all_messages
id: 140
---
Cron jobs can have there results returned as mail via the unix mail system. If left unchecked for a while the number of mails can mount up and you probably do not care about the old results. the command `d *` will delete all mails

    $ mail
    Mail version 8.1 6/6/93.  Type ? for help.
    "/var/mail/lounge": 2726 messages 25 new 2726 unread
    ? d *
    ? quit

    $ mail
    No mail for user
