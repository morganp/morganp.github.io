---
layout: post
title: "ORM(Activerecord) or Ruby Sort"
date: 2011-02-20 02:19:17 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Active Record
- Performance
- Programming
- Ruby
discuss_url: //92
url: //92/ORM%28Activerecord%29_or_Ruby_Sort
id: 92
---
Based on an [old Article][] I wrote, investigating incase sensitive sorting performance.

I have an active record model call Tag with tag and id properties, it contains 3000 randomly chosen and sorted words. 

<h3>My Summary of results:</h3>  
Average time for ORM (Activerecord) to return results 0.1928  
Average time for ORM to return sorted results 0.1290 (0.0638 quicker!)  
Ruby to sort (non-case sensitive) results 0.0138  
Ruby to sort pre-sorted* results 0.0606 (4.4 times slower!)  

\*Pre-sorted is case sensitive

More investigation is require, results could be effected by caching at the ORM/DB layer, but returning sorted results appears quicker than unsorted. and sorting in ruby is 4.4 times slower with pre sorted data.

The test:

    #For Benchmarking 
    require 'benchmark'
    include Benchmark

    bm(10) do |b|
           b.report("ORM") {        @tags = Tag.find(:all) }
           b.report("Sort by") {    @tags = @tags.sort_by { |tag| tag.tag.downcase }  }
           b.report("ORM sorted") { @tags = Tag.find(:all, :order => "tag") }
           b.report("Sort by") {    @tags = @tags.sort_by { |tag| tag.tag.downcase }  }
      end
    
      puts "same test but presorted after ruby sort"
      bm(10) do |b|
           b.report("ORM sorted") { @tags = Tag.find(:all, :order => "tag") }
           b.report("Sort by") {    @tags = @tags.sort_by { |tag| tag.tag.downcase }  }
           b.report("ORM") {        @tags = Tag.find(:all) }
           b.report("Sort by") {    @tags = @tags.sort_by { |tag| tag.tag.downcase }  }
     end

The results collated: ORM returning unsorted results

                user     system      total        real
    ORM         0.200000   0.010000   0.210000 (  0.216162)
    ORM         0.160000   0.000000   0.160000 (  0.171810)
    ORM         0.200000   0.020000   0.220000 (  0.215265)
    ORM         0.160000   0.000000   0.160000 (  0.167882)
    ORM         0.200000   0.020000   0.220000 (  0.216648)
    ORM         0.170000   0.000000   0.170000 (  0.169064)

Full ruby sort

    Sort by     0.010000   0.000000   0.010000 (  0.014169)
    Sort by     0.020000   0.000000   0.020000 (  0.012673)
    Sort by     0.010000   0.000000   0.010000 (  0.014791)
    Sort by     0.010000   0.000000   0.010000 (  0.012934)
    Sort by     0.020000   0.000000   0.020000 (  0.014387)
    Sort by     0.010000   0.000000   0.010000 (  0.013655)

Case-sensitive ORM sorting

    ORM sorted  0.110000   0.000000   0.110000 (  0.138993)
    ORM sorted  0.100000   0.010000   0.110000 (  0.135767)
    ORM sorted  0.110000   0.000000   0.110000 (  0.132612)
    ORM sorted  0.100000   0.000000   0.100000 (  0.150029)
    ORM sorted  0.100000   0.000000   0.100000 (  0.108307)
    ORM sorted  0.100000   0.000000   0.100000 (  0.108133)

Ruby sorting pre-sorted results

    Sort by     0.080000   0.000000   0.080000 (  0.132228)
    Sort by     0.020000   0.000000   0.020000 (  0.015885)
    Sort by     0.090000   0.000000   0.090000 (  0.102128)
    Sort by     0.010000   0.000000   0.010000 (  0.014791)
    Sort by     0.090000   0.000000   0.090000 (  0.086072)
    Sort by     0.010000   0.000000   0.010000 (  0.012341)


[old Article]: http://amaras-tech.co.uk/people/morgan/article/18
