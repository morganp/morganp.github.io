---
layout: post
title: "Ruby Search and Replace Script."
date: 2011-10-25 12:06:36 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Command Line
- Programming
- Ruby
discuss_url: //125
url: //125/Ruby_Search_and_Replace_Script.
id: 125
---
A small standalone script that search through a file doing text substitutions.

    #!/usr/bin/env ruby
    # Usage $ ruby_search_and_replace.rb file_to_update.txt
    
    def update_file( file_name )
      puts "Updating : #{file_name}"
      ::File.open( file_name, "rb"){ |f| @contents = f.read }
    
      ## Replace Renamed thing here
      #@contents.gsub!("search","replace")
      
      ::File.open( file_name, "w" ){ |f| f.write @contents }
    end
    
    if $0 == __FILE__
      #If file is called directly execute
      update_file( ::File.absolute_path( ARGV[0] ) )
    end


