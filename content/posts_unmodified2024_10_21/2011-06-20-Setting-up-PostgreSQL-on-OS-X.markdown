---
layout: post
title: "Setting up PostgreSQL on OS X"
date: 2011-06-20 11:35:31 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Database
- Ruby
discuss_url: //109
url: //109/Setting_up_PostgreSQL_on_OS_X
id: 109
---
An old guide is written on the [Apple Developer Forum][apple] however if you are using [Homebrew][] it is much simpler.

    $ brew install postgresql

Define a data area for the database to be stored.

    mkdir -p ~/.psgrs/data

Initialize the database folder:

    #initidb can be found here /usr/local/Cellar/postgresql/9.0.4/bin/
    $ initdb -D ~/.psgrs/data

Create the database:

    $ createdb example_dev

Start the postgresql server:

    # postgres can be found here /usr/local/Cellar/postgresql/9.0.4/bin
    $ postgres -D ~/.psgrs/data


Summary of Postgresql setup for Development
-------------------------------------------

    $ brew install postgresql
    $ mkdir -p ~/.psgrs/data
    $ initdb -D ~/.psgrs/data
    $ createdb example_dev
    $ postgres -D ~/.psgrs/data

A Rails database.yaml file might look something like:

    development:
        adapter: postgresql
        host: localhost
        port: 5432
        username: 
        password: 
        database: example_dev

    

[apple]: http://developer.apple.com/internet/opensource/postgres.htmlhttp://developer.apple.com/internet/opensource/postgres.html
[Homebrew]: https://github.com/mxcl/homebrew


