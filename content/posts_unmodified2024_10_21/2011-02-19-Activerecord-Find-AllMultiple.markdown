---
layout: post
title: "Activerecord Find All/Multiple"
date: 2011-02-19 06:31:03 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Ruby
discuss_url: //91
url: //91/Activerecord_Find_All%2FMultiple
id: 91
---
Using Tags (An active record model) to find tags by the tag property:

    Tag.find_by_tag("Ruby")
    Ruby
    
    Tag.find_by_tag(["Ruby", "Gem"])
    Ruby

 That did not return what I expected, find_ returns one object by default. first_ last_ or all_ modifiers can be used. So to find multiple tags by the same property:
 
    Tag.find_all_by_tag(["Ruby", "Gem"]) 
    Ruby
    Gem

Again with slightly less active record magic:  
Note the = ? for singular items and IN (?) for a list of items.

    Tag.find(:all, :conditions => ["tag = ?", "Ruby"])
    Ruby

    Tag.find(:all, :conditions => ["tag IN (?)", ["Ruby", "Gem"]])
    Ruby
    Gem

More info can be read on [Rails Guides][].

[Rails Guides]: http://lenary.co.uk/guides/active_record_querying.html#dynamic-finders
