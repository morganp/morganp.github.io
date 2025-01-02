---
layout: post
title: "Ruby Time Formats"
date: 2010-03-30 14:50:30 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //9
url: //9/Ruby_Time_Formats
id: 9
---
I have been playing around with getting my blog posts timestamped I found the [Ruby Time Docs][rubytime] to be very useful on getting the format I wanted. I settled on :

    $date_format = "%I:%M%p %b %d %Y"
    Time.now.strftime($date_format)
    #displays as 07:50PM Mar 30 2010 

Having this a a global means I can call it anywhere and teh time stamps will be displayed the same every where.

[rubytime]: http://ruby-doc.org/core/classes/Time.html#M000298
