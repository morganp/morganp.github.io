---
layout: post
title: "Ruby each or delete_if"
date: 2010-09-25 12:38:50 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //72
url: //72/Ruby_each_or_delete_if
id: 72
---
In ruby some times you want to iterate over an array and remove items that meet certain conditions, if using each the results may be unexpected.

    require 'pp'
    arr = [1,2,3,4,5,6,7]
    pp arr
    # => [1, 2, 3, 4, 5, 6, 7, 8]

    arr.each do |x|
       if x > 3
          arr.delete( x )
       end
    end
    pp arr
    # => [1, 2, 3, 5, 7]

5 and 7 were above 3 last time I checked, what is happening.  
NB: ^ points to the current item of the iterator.

    #    [1,2,3,4,5,6,7,8]
    #     ^                 -> 1 fails x > 3
    #    [1,2,3,4,5,6,7,8]
    #       ^               -> 2 fails x > 3
    #    [1,2,3,4,5,6,7,8]
    #         ^             -> 3 fails x > 3
    #    [1,2,3,4,5,6,7,8]
    #           ^           -> 4 true  x > 3, delete
    #    [1,2,3,5,6,7,8]    -- Intermidiate Array, before each is incremented
    #           ^
    #    [1,2,3,5,6,7,8]    -- Number 5 has slipped through the evaluation
    #             ^         -> 6 true x > 3, delete
    #    [1,2,3,5,7,8]      -- Intermidiate Array
    #             ^
    #    [1,2,3,5,7,8]      -- Number 7 has slipped through
    #               ^       -> 8 true x > 3, delete
    #    return [1,2,3,5,7] #Not what we expected from the code.

Introducing <strong>delete_if</strong>

    require 'pp'
    arr = [1,2,3,4,5,6,7,8,9,10]

    arr.delete_if do |x| 
       test = x > 3
       
       # Do something when not being deleted
       if not test
          puts x
       end
       test
    end
    pp arr
    # => [1, 2, 3]

