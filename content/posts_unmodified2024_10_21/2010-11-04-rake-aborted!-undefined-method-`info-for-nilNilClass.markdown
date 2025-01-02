---
layout: post
title: "rake aborted! undefined method `info' for nil:NilClass"
date: 2010-11-04 11:24:05 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Heroku
- Migrations
- Ruby
- Sinatra
discuss_url: //79
url: //79/rake_aborted%21_undefined_method_%60info%27_for_nil%3ANilClass
id: 79
---
I am currently switching between runing migrations locally on an sqlite3 database and postgres for production on Heroku.

When switching back to a local sqlite3 I got this error when running the migration.
    
    $ rake db:migrate

    (in /Users/path/to/top/level)
    ** Invoke db:migrate (first_time)
    ** Invoke environment (first_time)
    ** Execute environment
    ** Execute db:migrate
    rake aborted!
    undefined method `info' for nil:NilClass

The error I found through [Stackoverflow][] was that I had not defined a logger.

My rakefile.rb for sinatra applications to run activerecord migrations.

    require 'rubygems'
    require 'rake'
    require 'active_record'

    namespace :db do
      desc "Migrate the database through scripts in db/migrate. Target specific version with VERSION=x"
      task :migrate => :environment do
        ActiveRecord::Migrator.migrate('db/migrate', ENV["VERSION"] ? ENV["VERSION"].to_i : nil )
      end
    end

    task :environment do
      ActiveRecord::Base.establish_connection(
        :adapter => 'sqlite3',
        :database => 'db/local.db'
      )
      ActiveRecord::Base.logger = Logger.new(File.open('database.log', 'a'))

     # ActiveRecord::Base.establish_connection(
     #     :adapter  => 'postgresql',
     #     :host     => 'host',
     #     :username => 'user',
     #     :password => 'pass',
     #     :database => 'db'
     # )

    end

[Stackoverflow]: http://stackoverflow.com/questions/1719212/undefined-method-info-for-nilnilclass-when-running-active-record-migration
