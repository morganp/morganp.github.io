---
layout: post
title: "Sequel ORM Migrations"
date: 2010-03-31 09:07:51 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Sinatra
- Sequel
- Migrations
discuss_url: //11
url: //11/Sequel_ORM_Migrations
id: 11
---
Available as a [gist][gist] a Sequel Migration to rename a database column.

    ## Command line to apply Migration
    #sequel -m ./db/migrate/ -M 1 sqlite://db/data.db
    ## Command to roll back
    #sequel -m ./db/migrate/ -M 0 sqlite://db/data.db
 
    Class.new(Sequel::Migration) do
       def up
          DB.alter_table :aTable do
             rename_column :old, :new
          end
       end
 
       def down
         DB.alter_table :aTable do
            rename_column :new, :old
         end
       end
    end

[gist]: http://gist.github.com/348121
