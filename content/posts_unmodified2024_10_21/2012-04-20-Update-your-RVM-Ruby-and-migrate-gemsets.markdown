---
layout: post
title: "Update your RVM Ruby and migrate gemsets"
date: 2012-04-20 22:08:43 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Ruby
- RVM
discuss_url: //148
url: //148/Update_your_RVM_Ruby_and_migrate_gemsets
id: 148
---
Update RVM

    $ rvm get head

List current versions, and all versions 
 
    $ rvm list
    $ rvm list known

Select the version you want to upgrade to :

    $ rvm upgrade 1.9.3
    
    Are you sure you wish to upgrade from ruby-1.9.3-p125 to ruby-1.9.3-p194? (Y/n): Y  
    ...
    Are you sure you wish to MOVE gems from ruby-1.9.3-p125 to ruby-1.9.3-p194?
    This will overwrite existing gems in ruby-1.9.3-p194 and remove them from ruby-1.9.3-p125 (Y/n): Y
