---
layout: post
title: "Ruby, Ruby, Ruby, why are you so wierd at times?"
date: 2010-04-26 07:48:47 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Programming
discuss_url: //20
url: //20/Ruby%2C_Ruby%2C_Ruby%2C_why_are_you_so_wierd_at_times%3F
id: 20
---
This feature of ruby keeps catching me out as the behaviour is quite unexpected (by me).

I can use a '!' modifying function like so:

    html_string.gsub!("<pre>","<pre class=\"prettyprint\">")

Which works great apart from when the match string "&lt;pre&gt;" in this case is not found then it returns nil. Surely I would want the string unaltered instead, why would I want nil. So I generally have to replace it with the following:

    html_string = html_string.gsub("<pre>","<pre class=\"prettyprint\">")

[Update 27/04/2010]

Turns out it should not modify the the string but the function returns nil. This was the last line in a function call and so was an implicit return. The following would probably have been better:

    html_string.gsub!("<pre>","<pre class=\"prettyprint\">")
    return html_string

The returned nil could then be used as an if statment to take a different execution path if not modified:

    if /<pre>/ === html_string
       html_string = html_string.gsub("<pre>","<pre class=\"prettyprint\">")
    else
       puts "Does not contain <pre>"
    end

Could just become:

    if not html_string.gsub!("<pre>","<pre class=\"prettyprint\">")
       puts "Does not contain <pre>"
    end



