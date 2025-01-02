---
layout: post
title: "Ruby Basic File Read and Write"
date: 2011-07-01 20:38:27 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //113
url: //113/Ruby_Basic_File_Read_and_Write
id: 113
---
Read text file with one line:

    ::File.open( absolute_filename, "rb"){ |f| @contents = f.read }

Write text with one line :

    ::File.open( absolute_filename, "w" ){ |f| f.write @contents }

Explanation and other ways
--------------------------

When reading a text file in the open command rb implies 'read binary' mode which creates the .read method for the entire file. The following line looks simpler but the file object in not closed. If a block is passed `{ |io| block }` then the File is closed after the block completes.

    @contents = ::File.open( absolute_filename, "rb").read

That should could be broken into 3 lines so that the file object can be closed. This is equivalent to the first one line example.


    f = ::File.open( absolute_filename, "rb")
    @contents = f.read
    f.close
 
The File will be automatically closed when program quits but if you create a long life process with hundreds of files not closing might cause performance issues.
   
Line by Line read, block containd with `do end`

    @contents = ''
    ::File.open( absolute_filename, "r") do |f|
      f.each_line do |line|
        @contents += line
      end
    end

Write file, with explicit close.

    f = ::File.open( absolute_filename, "w" )
    f.write @contents
    f.close


