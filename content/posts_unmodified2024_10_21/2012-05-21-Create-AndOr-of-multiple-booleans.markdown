---
layout: post
title: "Create And,Or of multiple booleans"
date: 2012-05-21 11:35:19 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //167
url: //167/Create_And%2COr_of_multiple_booleans
id: 167
---
To reduce an array of Booleans to a single Boolean using enumerables reduce method:

    [true, true, true].reduce( :| ) ## OR
    => true
    [true, true, true].reduce( :& ) ## AND
    => true

    [false, false, false].reduce( :| ) ## OR
    => false
    [false, false, false].reduce( :& ) ## AND
    => false

    [true, true, false].reduce( :| ) ## OR
    => true
    [true, true, false].reduce( :& ) ## AND
    => false

Checksums (XOR)
--

    [false, false].reduce( :^ ) ## XOR
    => false
    [false, true ].reduce( :^ ) ## XOR
    => true
    [true, false ].reduce( :^ ) ## XOR
    => true
    [true, true  ].reduce( :^ ) ## XOR
    => false
