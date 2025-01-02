---
layout: post
title: "Active Record create unique or return existing element"
date: 2010-08-08 09:20:39 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Programming
- Ruby
discuss_url: //60
url: //60/Active_Record_create_unique_or_return_existing_element
id: 60
---
When working with databases it is often a requirement to have unique elements (columns) which are not the primary key, this can be achieved in the active record model with:

    require 'rubygems'
    require 'sequel'
    DB = Sequel.sqlite('./lesson4.db')
    DB.create_table :tags do
       primary_key :id
       varchar :tag
    end  

    require 'rubygems'
    require 'active_record'
    ActiveRecord::Base.establish_connection(
      :adapter   => 'sqlite3',
      :database  => './lesson4.db'
    )
    class Tag <  ActiveRecord::Base
       validates_uniqueness_of :tag, :scope => :tag
    end

    @tag = Tag.create( :tag => "duck" )
    ##<Tag id: 1, tag: "duck">
    @tag = Tag.create( :tag => "duck" )
    ##<Tag id: nil, tag: "duck">

So you can see that this constraint works nicely to stop duplicates, if it does find one it does not return the existing element, good for creating but not reusing existing elements.

I find that the following method is usually what I want:
   
    require 'rubygems'
    require 'active_record'
    ActiveRecord::Base.establish_connection(
      :adapter   => 'sqlite3',
      :database  => './lesson4.db'
    )
    class Tag <  ActiveRecord::Base
    end 

    @tag = Tag.find_or_create_by_tag("lazy")
    ##<Tag id: 2, tag: "lazy">
    @tag = Tag.find_or_create_by_tag("lazy")
    ##<Tag id: 2, tag: "lazy">

\[Added Friday 13/08/2010\]
If you need to run some code between creating and saving the object there is also find_or_initialize_by_

    @tag = Tag.find_or_initialize_by_tag("quack")
    @tag.save

This may be useful if you have  accessible or protected attributes, 'attr_accessible' 'attr_protected' which may block some properties from being initialised correctly.


I discovered this in the depths of [ActiveRecord Base][arbase]

[arbase]: http://api.rubyonrails.org/classes/ActiveRecord/Base.html

