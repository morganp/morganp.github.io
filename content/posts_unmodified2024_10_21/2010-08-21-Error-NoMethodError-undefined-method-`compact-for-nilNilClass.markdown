---
layout: post
title: "Error: NoMethodError: undefined method `compact' for nil:NilClass"
date: 2010-08-21 07:20:40 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Command Line
- Programming
- Sequel
discuss_url: //64
url: //64/Error%3A_NoMethodError%3A_undefined_method_%60compact%27_for_nil%3ANilClass
id: 64
---
When running a sequel migration I kept getting this error:   
<strong>Error: NoMethodError: undefined method `compact' for nil:NilClass</strong>

My setup looked like this:

    ./db/data.db
    ./db/migrate/001-Create_table.rb
    
The failing command
    $ sequel -m ./db/migrate/ -M 1 sqlite://db/data.db

The error in this instance was caused by having '-' in the file name of the migration. To fix this I changed to:

    ./db/data.db
    ./db/migrate/001_Create_table.rb
    
Some [ORM active record and sequels lessons I prepared earlier][ormlesson].

[ormlesson]: http://github.com/morganp/Code-Dojo/tree/master/ORM
