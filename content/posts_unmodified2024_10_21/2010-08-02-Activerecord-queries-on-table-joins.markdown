---
layout: post
title: "Activerecord queries on table joins"
date: 2010-08-02 11:33:16 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Migrations
- Programming
- Ruby
- Active Record
discuss_url: //59
url: //59/Activerecord_queries_on_table_joins
id: 59
---
An example of joining tables through active record models. There is [a good tutorial on the basics][basics] of Activerecord joins.
For this example we will have Posts and People, we will not use a grammatical parser and will beusing plural of people as peoples. (Note: should be person and persons) Create table with something like:

    require 'rubygems'
    require 'sequel'
    DB = Sequel.sqlite('./example.db')
    
    DB.create_table :posts do
       primary_key :id
       foreign_key :people_id, :peoples
       varchar :title
       text :body
    end

    DB.create_table :peoples do
       primary_key :id
       varchar :first_name
       varchar :last_name
       varchar :short_name
    end

Now the active record model should be something like:
NB I have added the foreign key specifier as I could not find migrations to modify it.

    require 'rubygems'
    require 'active_record'

    ActiveRecord::Base.establish_connection(
       :adapter   => "sqlite3",
       :database  => "./example.db"
    )

    class People < ActiveRecord::Base
       has_many :post, :foreign_key => :people_id

    end
    
    class Post < ActiveRecord::Base
       # mmm No foregin key required for this
       belongs_to :people
    end


This allows ORM automatic joins:

    @person = People.first
    @posts  = @person.post

    @post   = Post.first
    @person_name = @post.people.first_name

    #Now get 3 posts by a particular author and sort
    @person = People.first
    @posts = @person.post.find(:all, :order => "id DESC", :limit => 3) 


[basics]: http://guides.rubyonrails.org/association_basics.html
[1]: http://snippets.dzone.com/posts/show/3097
[2]: http://api.rubyonrails.org/classes/ActiveRecord/Base.html#M001880


