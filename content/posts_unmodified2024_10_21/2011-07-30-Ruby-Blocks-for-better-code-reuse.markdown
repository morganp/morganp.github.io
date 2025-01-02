---
layout: post
title: "Ruby Blocks for better code reuse"
date: 2011-07-30 13:51:28 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //121
url: //121/Ruby_Blocks_for_better_code_reuse
id: 121
---
While working on some disk space / folder structure scripts I had several functions which hierarchically search the disk then performed some custom function. When refactoring the code I realised that the specific functions could be contained in a block and passed to a generic search method.

This is one of the original functions

    def search_folder( folder )
      sub_folders = Dir.glob( folder + '*/')
      sub_files   = Dir.glob( folder + '*.*')
    
      ## Recursive
      sub_folders.each do |sub_folder|
        search_folder( sub_folder )
      end

      sub_files.each do | sub_file |
       if sub_file.match(/\.rar$/)
        puts sub_file    
        end
      end
    end

Refactored to take a block

    def search_folder( folder, &block )

      sub_folders = Dir.glob( folder + '*/')
      sub_files   = Dir.glob( folder + '*.*')

      ## Recursive
      sub_folders.each do |sub_folder|
        search_folder( sub_folder, &block )
      end

      sub_files.each do | sub_file |
        yield(sub_file)
      end
    end


And where the original method was called replace with:

    search_folder( folder ) do |file|
      if file.match(/\.rar$/)
         puts file
      end
    end



Encapsulate with Modules
----------------------

Wrapping the generic methods up into a module and calling local methods from the block.

    module GenericStuff

      def self.search_folder( folder, &block )
        sub_folders = Dir.glob( folder + '*/')
        sub_files   = Dir.glob( folder + '*.*')

        ## Recursive
        sub_folders.each do |sub_folder|
          search_folder( sub_folder, &block )
        end

        sub_files.each do | sub_file |
          yield(sub_file)
        end
      end
    end


    def limit
      @count ||= 1
      puts "Count is " + @count.to_s
      if @count > 2
        exit( -1 )
      end
      @count += 1
    end

    # Call to generic method, block calls local method
    folder = '/'    
    GenericStuff::search_folder( folder ) do |file|
      if file.match(/\.rar$/)
        limit
        puts file
      end
    end

