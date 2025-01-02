---
layout: post
title: "Ruby incase sensitive sort"
date: 2010-04-18 11:13:51 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //18
url: //18/Ruby_incase_sensitive_sort
id: 18
---
Ruby has a .sort method which sorts basic objects. it is case sensitive though so Zebra is before apple. Using sort_by instead you can specify the sort key.

    some_array.sort_by { |x| x.downcase }

There is a good description/discussion of the performance issues of this on [ruby-docs][sort_by]

Since the [ruby-docs][sort_by] mention performance issues I though it would be worth noting  that in my blog app I have the option to pre sort with the ORM. this shouldmake the ruby sory much faster to execute as it is already mostly sorted, but how does this effect the performance of the ORM
 
    def all_tags_sort
       @tags = Tags.find(:all, :order => "tag")
       @tags = @tags.sort_by { |tag| tag.tag.downcase }
    end

VS

    def all_tags_sort
       @tags = Tags.find(:all)
       @tags = @tags.sort_by { |tag| tag.tag.downcase }
    end

For the performance test I added this to one of views that displays the tags

    #For Benchmarking
    require 'benchmark'
    include Benchmark
    
    bm(10) do |b|
       b.report("ORM") { @tags = Tags.find(:all) }
       b.report("Sort by") { @tags = @tags.sort_by { |tag| tag.tag.downcase }  }
       b.report("ORM sorted") { @tags = Tags.find(:all, :order => "tag") }
       b.report("Sort by") { @tags = @tags.sort_by { |tag| tag.tag.downcase }  }
    end
To test I built up a small dictionary using this [gist][gist] (sorted by default so have to randomise it alittle bit)

                       user     system      total        real
    ORM           53.920000   3.650000  57.570000 ( 57.960210)
    Sort by        4.750000   0.320000   5.070000 (  5.091083)
    ORM sorted    45.080000   3.590000  48.670000 ( 49.554891)
    Sort by        2.700000   0.310000   3.010000 (  3.016042)

mmm, data does not look write as retrieving and sorting was quicker than just retrieving will run with the order swapped.

                    user     system      total        real
    ORM sorted 10.290000   1.740000  12.030000 ( 12.087005)
    Sort by     0.930000   0.130000   1.060000 (  1.054450)
    ORM        11.740000   1.700000  13.440000 ( 13.453623)
    Sort by     0.760000   0.130000   0.890000 (  0.886095)

Sorting in the ORM layer still seems to be quicker than not sorting, and the Ruby sorting takes same length of time. So looks like applying the sort is a worthwhile.

[sort_by]: http://ruby-doc.org/core/classes/Enumerable.html#M003120
[gist]: http://gist.github.com/370533
