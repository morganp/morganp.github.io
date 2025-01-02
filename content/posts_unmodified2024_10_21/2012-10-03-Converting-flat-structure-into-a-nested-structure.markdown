---
layout: post
title: "Converting flat structure into a nested structure"
date: 2012-10-03 20:11:12 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //200
url: //200/Converting_flat_structure_into_a_nested_structure
id: 200
---
Given a flat hierarchy of data comprising level and a label, aim to nest the lower level of objects in to the parents.

Example data: 

      0, 'a'
      1, 'b'
      2, 'c'
      2, 'd'
      1, 'e'
      2, 'f'
 
Converted to a structure similar to:

    a
    +b
    |+c
    |+d
    +e
     +f

An Unoptimised Solution
--

A simple object, which allows adding child objects

    Thing = Struct.new(:level, :label, :children)
    class Thing
      def add_child (child)
        children << child
      end
    end

The data:

    list =
    [ Thing.new(0, "a", []),
      Thing.new(1, "b", []),
      Thing.new(2, "c", []),
      Thing.new(2, "d", []),
      Thing.new(1, "e", []),
      Thing.new(2, "f", [])
    ]

My approach is to find the lowest children and fold them in to the parent above it. The first step is a method to calculate the nesting depth. 

    def lowest_level( list )
      level = 0
      list.each do |obj|
        level = obj.level if obj.level > level
      end
      return level
    end

    puts "Lowest Level is #{lowest_level( list )}"
    => Lowest Level is 2

The main part of the solution now is to loop over the list, adding the object at the lowest_level to its parent, then removing it from its original position. The parent object is defined as being in the position before with a level 1 above the current node. 

          current_fold = lowest_level( list )

          list.each_with_index do |thing, index|
            # Identify if on a lowest leaf which can be folded
            if ( ( thing.level == current_fold ) && (list[index-1].level == current_fold-1))
              list[index-1].add_child( thing )
              list.delete_at(index)
            end
          end

The main performance issue I have with this solution is it requires an iteration for every object at the same level wiith the same parent. ie 1222 would take 3 iterations to fold the 2s, 122212 would still take 3 iterations.

The loop in full:

    def fold_list( list )
      ## Clone data for immutable operation
      list = Marshal.load(Marshal.dump( list ))
      fold_list!( list )
    end

    def fold_list!( list )
      while ( lowest_level( list ) > 0 ) do
        #Find Current lowest Level and fold
        current_fold = lowest_level( list )

        while( current_fold == lowest_level( list ) ) do
          list.each_with_index do |thing, index|
            # Identify if on a lowest leaf which can be folded
            if ( ( thing.level == current_fold ) && (list[index-1].level == current_fold-1))
              list[index-1].add_child( thing )
              list.delete_at(index)
            end
          end
        end
      end

      return list
    end

    require 'pp'
    pp  fold_list( list )

The result, showing the folding:

    [#<struct Thing
      level=0,
      label="a",
      children=
       [#<struct Thing
         level=1,
         label="b",
         children=
          [#<struct Thing level=2, label="c", children=[]>,
           #<struct Thing level=2, label="d", children=[]>]>,
        #<struct Thing
         level=1,
         label="e",
         children=[#<struct Thing level=2, label="f", children=[]>]>]>]

