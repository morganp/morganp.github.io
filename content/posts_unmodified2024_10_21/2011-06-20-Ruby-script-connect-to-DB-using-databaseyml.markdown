---
layout: post
title: "Ruby script connect to DB using database.yml"
date: 2011-06-20 12:07:51 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Database
- Git
- Programming
- Ruby
discuss_url: //110
url: //110/Ruby_script_connect_to_DB_using_database.yml
id: 110
---
To connect to a rails style DB config outside of the normal workflow, or using a database.yml in a different workflow:

    require 'yaml'
    require 'active_record'

    environment = ENV['RACK_ENV'] || 'development'
    dbconfig    = YAML.load(File.read('config/database.yml'))
    ActiveRecord::Base.establish_connection dbconfig[environment]

    #Load All models 
    Dir.glob("./app/models/*").each do |file|
      require file 
    end

    #Now use Active record as you normally would
    # @user = User.create( :name => 'Dave' )
    # @user.save
    # @first_person = User.first

An example database.yml

    development:
        adapter: postgresql
        host: localhost
        port: 5432
        username: 
        password: 
        database: example_dev
