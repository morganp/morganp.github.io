---
layout: post
title: "Print nested array structures in table format"
date: 2012-10-03 20:47:13 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Programming
discuss_url: //201
url: //201/Print_nested_array_structures_in_table_format
id: 201
---
Problem
--

Take an array of arrays and format it for displaying to the terminal or outputting to a text file.

Sample Data:
   
    data = [[1,2,3,4,5],["Four","Five","Six"],["Seven","Eight","Nine","Ten"]]

Solution
--

The main issue I see is working out how wide to make each column. My solution is to iterate over the data keeping track of the maximum width found for each column.

Once we know how wide to make each column printing the table is just a matter of a second iteration over the data using ljust or rjust to align all the columns.

    def print_table( data )
      #Clone/dup nested structure
      data = Marshal.load(Marshal.dump(data))
      #data = data_array.dup
      lengths = []
    
      data.each do |line| 
        line.each_with_index do |item, column| 
          length          = item.to_s.size
          lengths[column] = length if length > (lengths[column] ||= 0)
        end
      end
    
      data.each do |line| 
        line.each_with_index do |item, column|
          line[column] = item.to_s.rjust(4+lengths[column])
          print line[column]
        end
        puts
      end
    
      return data
    end

The result:

    data = [[1,2,3,4,5],["Four","Five","Six"],["Seven","Eight","Nine","Ten"]]
    data = print_table( data )
    
    =>        1        2       3      4    5    
    =>     Four     Five     Six
    =>    Seven    Eight    Nine    Ten

Alternative Solution
--

Use the [terminal-table](http://github.com/visionmedia/terminal-table) gem. Which creates nice ASCII tables.

    #gem install terminal-table

    require 'terminal-table'
    data = [[1,2,3,4,5],["Four","Five","Six"],["Seven","Eight","Nine","Ten"]]
    table = Terminal::Table.new :rows => data

    puts table
    +-------+-------+------+-----+---+
    | 1     | 2     | 3    | 4   | 5 |
    | Four  | Five  | Six  |
    | Seven | Eight | Nine | Ten |
    +-------+-------+------+-----+---+

