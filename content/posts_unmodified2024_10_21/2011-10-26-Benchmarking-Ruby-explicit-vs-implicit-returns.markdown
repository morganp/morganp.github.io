---
layout: post
title: "Benchmarking Ruby, explicit vs implicit returns"
date: 2011-10-26 09:12:29 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //128
url: //128/Benchmarking_Ruby%2C_explicit_vs_implicit_returns
id: 128
---
Back in 2009 [barkingiguana][source] wrote about how explicit returns `'return "String"'` was slower than an implicit return, ie just letting the last value get returned. The test was performed on ruby 1.8.6 and I thought I would just check with ruby 1.9.2-p290 to see if this still held true.

The test I ran:

    require 'benchmark'

    def explicit
      return "TEST"
    end

    def implicit
      "TEST"
    end

    def explicit_non_eval
      return 'TEST'
    end

    def implicit_non_eval
      'TEST'
    end

    def explicit_symbol
      return :TEST
    end

    def implicit_symbol
      :TEST
    end

    n = 100_000_000
    Benchmark.bmbm do |x|
      x.report("Explicit \"\"     return") { n.times { explicit } }
      x.report("Implicit \"\"     return") { n.times { implicit } }
      x.report("Explicit ''     return") { n.times { explicit_non_eval } }
      x.report("Implicit ''     return") { n.times { implicit_non_eval } }
      x.report("Explicit symbol return") { n.times { explicit_symbol   } }
      x.report("Implicit symbol return") { n.times { implicit_symbol   } }
    end

the results

    Rehearsal ----------------------------------------------------------
    Explicit ""     return  37.810000   0.000000  37.810000 ( 37.889241)
    Implicit ""     return  36.300000   0.000000  36.300000 ( 36.310153)
    Explicit ''     return  36.460000   0.000000  36.460000 ( 36.476939)
    Implicit ''     return  36.520000   0.010000  36.530000 ( 36.541361)
    Explicit symbol return  14.330000   0.000000  14.330000 ( 14.352004)
    Implicit symbol return  14.330000   0.000000  14.330000 ( 14.322934)
    ----------------------------------------------- total: 175.760000sec
    
                                 user     system      total        real
    Explicit ""     return  37.620000   0.000000  37.620000 ( 37.680337)
    Implicit ""     return  36.480000   0.000000  36.480000 ( 36.504694)
    Explicit ''     return  36.560000   0.000000  36.560000 ( 36.574798)
    Implicit ''     return  36.100000   0.010000  36.110000 ( 36.111328)
    Explicit symbol return  14.770000   0.000000  14.770000 ( 14.812874)
    Implicit symbol return  14.710000   0.000000  14.710000 ( 14.829556)

For me the difference I see in the results between implicit and explicit returns is negligible. I also prefer the explicit return in all but the simplest of methods, as it is much easier to see what value gets returned and at which point the programmer want the method to exit. It also helps to minimize the side effects of re-factoring.

[Barkingiguana][source] seems to prefer the implicit style which is possibly more idiomatic ruby, but I personally find that it adds ambiguity to the code for beginners to intermediate rubyists.

[source]: http://barkingiguana.com/2009/11/11/returning-explicitly-is-slower/
