---
layout: post
title: "Ruby special exception variables made mnemonic"
date: 2012-05-19 14:56:56 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //164
url: //164/Ruby_special_exception_variables_made_mnemonic
id: 164
---
In ruby you can catch StandardErrors using begin rescue end

    begin
      #Some thing which might fails
    rescue
      $stderr.puts $!
    end

We can add a mnemonic variable name to the captured error using :

    begin
      #Some thing which might fails
    rescue => error
      $stderr.puts error
    end

Other [Special Ruby Variables][special]. I am not sure on the completeness of that list so [here is another][special1] and [another][special2].

For more on Ruby error handling I would recommend [Avdi Grimms book Exceptional Ruby][exc-ruby]


[special]: http://ruby.wikia.com/wiki/Special_variable
[special1]: http://ruby.runpaint.org/globals
[special2]: http://www.zenspider.com/Languages/Ruby/QuickRef.html#pre-defined-variables
[exc-ruby]: http://exceptionalruby.com
