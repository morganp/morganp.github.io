---
layout: post
title: "Arrays 3, write idiomatic Ruby"
date: 2011-10-25 12:44:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //126
url: //126/Arrays_3%2C_write_idiomatic_Ruby
id: 126
---
Previous posts [arrays][] and [arrays2][]

Based on a post by [barkingiguana][], some idiomatic ruby ways to handle arrays.
Ruby tries to have a natural language style, preferring to be more expressive to designers intent rather than close to the computers internal behavior.

Both the statements are the same but the second is preferred.

    bookmarks.size == 0
    bookmarks.empty?

Ask an array if it has any elements. Don't check if it has a non-zero size.
for the inverse of the above statement checking that we have elements, again the second statement is preferred.

    bookmarks.size > 0 
    bookmarks.any?

Other language might have some thing like:

    if (bookmarks.size == 0) {
      # Add first bookmark
    }

Ruby 

    if bookmarks.empty?
      #Add first bookmark
    end

I think the ruby actually reads better and conveys what you are actually trying to do, check the array is empty. With duck typing any object could get passed to this as long as it has the empty? method defined, an object might have header information and a payload. If the payload was implemented as an Array the object could map the empty? onto it. 

Previous posts [arrays][] and [arrays2][]

[barkingiguana]: http://barkingiguana.com/2011/03/14/be-cool-with-arrays/
[arrays]: http://amaras-tech.co.uk/people/morgan/article/108
[arrays2]: http://amaras-tech.co.uk/people/morgan/article/122
