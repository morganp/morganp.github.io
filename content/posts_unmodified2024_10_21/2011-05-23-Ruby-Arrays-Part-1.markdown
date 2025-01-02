---
layout: post
title: "Ruby Arrays, Part 1"
date: 2011-05-23 23:37:26 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //108
url: //108/Ruby_Arrays%2C_Part_1
id: 108
---
Some uses of Arrays that were not apparent at first.

Enumeration
-----------

[each][] is the basic enumerator method but there is also [each_with_index][] (and for hashes [each_pair][])

    ['a', 'b', 'c', 'd'].each {|item| puts item }
    ['a', 'b', 'c', 'd'].each_with_index {|item,index| puts "#{index}:#{item}" }
    {:a=>1, :b=>2}.each_pair {|key,value| puts "#{key}=>#{value}" }

Sorting
-------

Sort is very easy with ruby if you want a basic sort \[4,5,3,2,7\].sort will do. However sorting by any key is possible using sort_by. Sort_by performs a [Schwartzian Transform][Schwartzian]

    ['a','B','D','c'].sort
    #=> ["B", "D", "a", "c"]
    ['a','B','D','c'].sort_by {|x| x.downcase }
    #=> ["a", "B", "c", "D"]    

Return Arrays
-------------

When you want an array, map modifies the contents of each element:

    [1,2,3,4].map {|i| i*2 }
    #=> [2,4,6,8]
    # or with any enumerable (Range)
    (1..4).map {|i| i*2 }


select and reject can be used to select and remove elements from the enumerable, and return a new enumerable, they are immutable methods.

    [0,1,2,3,4,5].select { |x| x > 2 }
    #=> [3,4,5]
    [0,1,2,3,4,5].reject { |x| x < 3 }
    #=> [3,4,5]

select! and reject! (bang operators) modify the existing enumerable. They have more natural names that I think should be used when appropriate, keep_if and delete_if.

    [0,1,2,3,4,5].keep_if { |x| x > 2 }
    #=> [3,4,5]
    [0,1,2,3,4,5].delete_if { |x| x < 3 }
    #=> [3,4,5]

Reduction to a Single Value
---------------------------

inject can be called on any enumerable object, it iterates over each item with an accumulator.

    [1,2,3,4].inject {|memory, item| memory * (item+1) } 

For basic operations there is the reduce method which can be used for summing and multiplying out the arrays.

Sum:

     [1,2,3,4].reduce :+

Multiply:

    [1,2,3,4].reduce :*

Booleans
--------

[include?][] is used to check if the array contains the supplied object.

    ['a','b','c'].include?( 'b' )
    #=> true

[all?][] and [any?][] can be used to check if the array matches against given criteria.

    [1,2,3,4].any?{|x| x > 3 }
    #=> true
    [1,2,3,4].all?{|x| x > 3 }
    #=> false
    [1,2,3,4].any?{|x| x > 5 }
    #=> false
    [1,2,3,4].all?{|x| x > 0 }
    #=> true

I often use [any?][] with an array of regular expressions to match a string to any item.
    
    text   = "one"
    search = [/one/, /two/, /three/]
    found  = search.any? { |regexp| text.match( regexp ) }
    #=> true

[each]: http://ruby-doc.org/core/classes/Array.html#M000231
[each_with_index]: http://ruby-doc.org/core/classes/Enumerable.html#M001511
[each_pair]: http://ruby-doc.org/core/classes/Hash.html#M000741
[all?]: http://ruby-doc.org/core/classes/Enumerable.html#M001499
[any?]: http://ruby-doc.org/core/classes/Enumerable.html#M001500
[include?]: http://ruby-doc.org/core/classes/Enumerable.html#M001510
[Schwartzian]: http://amaras-tech.co.uk/people/morgan/article/98

