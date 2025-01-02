---
layout: post
title: "Ruby send message to stderr"
date: 2011-12-22 11:56:25 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //131
url: //131/Ruby_send_message_to_stderr
id: 131
---
When creating applications normal messages should go to [stdout][] and error messages should go to [stderr][], unfortunately there is not a nice ruby way the cleanest I have found is:

    put "Message displayed in stdout"
    $stderr.puts "Error displayed in stderr"

[stdout]: http://en.wikipedia.org/wiki/Standard_streams#Standard_output_.28stdout.29
[stderr]: http://en.wikipedia.org/wiki/Standard_streams#Standard_error_.28stderr.29
