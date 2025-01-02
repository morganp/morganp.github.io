---
layout: post
title: "Sinatra ActiveRecord DB config on Heroku"
date: 2011-06-22 10:04:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Automation
- Database
- Heroku
- Regex
- Ruby
- Sequel
- Sinatra
- Web
discuss_url: //111
url: //111/Sinatra_ActiveRecord_DB_config_on_Heroku
id: 111
---
To make an automatic [ActiveRecord][] database connection using ENV\['DATABASE_URL'\] The following snippet can be used:

From [ActiveRecord 3.2.1](http://apidock.com/rails/v3.2.1/ActiveRecord/Base/establish_connection/class) connections can be made with :

    ActiveRecord::Base.establish_connection(ENV["DATABASE_URL"])

At some stage My first example also stopped working, Heroku have this example on there pages:

      db = URI.parse(ENV['DATABASE_URL'] || 'postgres://localhost/mydb')

      ActiveRecord::Base.establish_connection(
        :adapter  => db.scheme == 'postgres' ? 'postgresql' : db.scheme,
        :host     => db.host,
        :port     => db.port,
        :username => db.user,
        :password => db.password,
        :database => db.path[1..-1],
        :encoding => 'utf8'
      )


My original example for parsing the env variable and making he DB connection.

    module ExampleSinatra
      class App < Sinatra::Base
        use Rack::MethodOverride
        set :public, "public"

        configure :production do
          db = ENV["DATABASE_URL"]
          if db.match(/postgres:\/\/(.*):(.*)@(.*)\/(.*)/) 
            username = $1
            password = $2
            hostname = $3
            database = $4

            ActiveRecord::Base.establish_connection(
              :adapter  => 'postgresql',
              :host     => hostname,
              :username => username,
              :password => password,
              :database => database
            )
          end
        end
      end
    end
    if $0 == __FILE__
      ExampleSinatra::App.run!
    end

From Heroku connecting using [Sequel][] or [Datamapper][] is a little simpler:

    Sequel.connect(ENV['DATABASE_URL'] || 'sqlite://my.db')
    DataMapper.setup(:default, ENV['DATABASE_URL'] || 'sqlite3://my.db')

[ActiveRecord]: http://api.rubyonrails.org/classes/ActiveRecord/Base.html
[Sequel]: http://sequel.rubyforge.org/
[Datamapper]: http://datamapper.org/
