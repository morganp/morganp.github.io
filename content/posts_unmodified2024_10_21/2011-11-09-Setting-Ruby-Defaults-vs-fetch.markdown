---
layout: post
title: "Setting Ruby Defaults '||' vs 'fetch(){}'"
date: 2011-11-09 17:29:10 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Performance
- Programming
- Ruby
discuss_url: //129
url: //129/Setting_Ruby_Defaults_%27%7C%7C%27_vs_%27fetch%28%29%7B%7D%27
id: 129
---
There is a very good presentation [Confident Code][cc] by [Avdi Grimm][avdi] author of [http://exceptionalruby.com/][exceptional]. [Previously presented at Cascadia][video].

There are many points which I find interesting, the most interesting for me are the ones which I disagree with, probably due to not understanding them in full.

I use to do this for setting defaults.

    def something( a, options={} )
      width = options[:width]
      width ||= 40
    end

I had not realized that this could be shortened to:

    def something( a, options={} )
      width = options[:width] || 40
    end

Avdi recommends that you use fetch instead (see below) as this has one less comparison. It is actually a longer statement and at the end replaces || 40 with {40} both just as ambiguous to non ruby programmers. So I have a preference for neither based on readability.

    def something( a, options={} )
      width = options.fetch(:width) { 40 }
    end

Maybe the 'one less comparison' argument has some holding on execution time.
NB: Tested with ruby 1.9.2-p290 

The Test:

    require 'benchmark'

    def pipe options
      width = options[:width]
      width ||= 40
      return width
    end

    def pipe_clean options
      width = options[:width] || 40
      return width
    end

    def fetch options
      width = options.fetch(:width) { 40 }
      return width
    end

    n = 100_000_000
    Benchmark.bmbm do |x|
      options={}
      x.report("options \\n ||= 40    :") { n.times { pipe(       options ) } }
      x.report("options[] ||      40 :")  { n.times { pipe_clean( options ) } }
      x.report("options.fetch() {40} :")  { n.times { fetch(      options ) } }
    end

The Results:

    Rehearsal ----------------------------------------------------------------------
    options \n ||= 40    :  30.700000   0.000000  30.700000 ( 30.702585)
    options[] ||      40 :  28.480000   0.010000  28.490000 ( 28.492345)
    options.fetch() {40} :  38.720000   0.000000  38.720000 ( 38.731869)
    ------------------------------------------------------------ total: 97.910000sec
    
                                             user     system      total        real
    options \n ||= 40    :  30.490000   0.000000  30.490000 ( 30.494530)
    options[] ||      40 :  28.400000   0.000000  28.400000 ( 28.399310)
    options.fetch() {40} :  39.230000   0.000000  39.230000 ( 39.234303)

Since I am ambivalent to the 2 styles '||' vs 'fetch(){}' I think I will go with the 27% faster '||' version.


[cc]: http://avdi.org/talks/confident-code-rubymidwest-2011/
[avdi]: http://avdi.org/
[exceptional]: http://exceptionalruby.com/
[video]: http://confreaks.net/videos/614-cascadiaruby2011-confident-code
