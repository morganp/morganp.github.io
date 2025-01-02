---
layout: post
title: "irb as a Megapixels calculator"
date: 2012-02-12 18:56:40 +0000 
comments: true
sharing: true
footer: true
categories: Photography
tags:
- Command Line
- Photography
- Ruby
discuss_url: //138
url: //138/irb_as_a_Megapixels_calculator
id: 138
---
I have just added the method below to my ruby .irbrc file for quickly calculating image megapixels. from OS X the info panel gives the form of '23309 × 4412' this becomes '23309???4412' when pasted into iTerm.
 
    def megapixels( dimensions )
      if dimensions.match(/\d*x\d*/)
        x,y = dimensions.split('x')
      end
      if dimensions.match(/\d*\?\?\?\d*/)
        x,y = dimensions.split('???')
      end    
    
      if x.nil? or y.nil? 
        $stderr.puts "The input #{dimensions} could not be parsed in to megapixels"
        exit -1
      end
      x = x.to_i
      y = y.to_i
    
      megapixels = (x*y)/10.0**6
    end
