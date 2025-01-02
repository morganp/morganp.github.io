---
layout: post
title: "Storing secret keys in Ruby config files an approach"
date: 2010-09-11 19:04:53 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Git
- Programming
- Ruby
discuss_url: //71
url: //71/Storing_secret_keys_in_Ruby_config_files_an_approach
id: 71
---
I have for a while wondered about an ideal (good) approach to storing api keys in config files in ruby projects. A few conditions must be met:  
1) A new user must be given clear instructions on what has to be configured (until it is done), with boiler plate to complete.  
2) git must not accidentally let you submit the key.  

Gregory Brown steered me towards this setup. Create a config.rb file fill out the template for adding data. Then copy it to config.rb.example and add config.rb to the .gitignore

    touch config.rb
    #setup template of config.rb
    cp config.rb config.rb.example
    echo "config.rb" >> .gitignore
    git add config.rb.example

The file requiring the keys can then do something like:

    begin
      require "config"
    rescue LoadError
      STDERR.puts "You need to create a file called config.rb. See config.rb.example"
    exit

A slightly larger example.  
shorturl.rb

      require 'net/http'
      require 'rubygems'
      require 'json'
      require 'cgi'

      begin 
         require File.dirname(__FILE__) + '/bit_ly_key'
      rescue LoadError
       STDERR.puts "You need to create a file called bit_ly_key.rb. See bit_ly_key.rb.example"
       exit
      end

      module TechNews
         class Shorturl
            def initialize( url=nil )
               bit_ly_keys = TechNews::BitLyKey.new

               ##  url encode
               url ||= "http://amaras-tech.co.uk"
               @long_url = CGI.escape( url )
               payload   = "http://api.bit.ly/v3/shorten?login=#{bit_ly_keys.login}&apiKey=#{bit_ly_keys.apiKey}&longUrl=#{@long_url}&format=json"
               @response = Net::HTTP.get URI.parse(payload)
               @response = JSON.parse( @response )
            end

            def get_shorturl
               return @response["data"]["url"]
            end

         end
      end

      if $0 == __FILE__
         x = TechNews::Shorturl.new()
         puts x.get_shorturl
      end

bit_ly_key.rb

    # Register at [1] and get api key [2]
    # [1]: http://bit.ly
    # [2]: http://bit.ly/a/your_api_key

    module TechNews
       class BitLyKey
          attr_reader :login, :apiKey

          def initialize
             @login  = ""
             @apiKey = ""
          end

       end
    end
