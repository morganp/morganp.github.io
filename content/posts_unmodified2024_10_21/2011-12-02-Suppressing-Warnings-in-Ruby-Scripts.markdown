---
layout: post
title: "Suppressing Warnings in Ruby Scripts"
date: 2011-12-02 10:13:29 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
- Ruby
discuss_url: //130
url: //130/Suppressing_Warnings_in_Ruby_Scripts
id: 130
---
Suppressing warnings is usually a bad idea but if you understand the risk and want to carry on regardless. When ruby to call a script then the warning level can be set via:

    $ ruby -W0 ./script.rb
    $ ruby -W1 ./script.rb
    $ ruby -W2 ./script.rb

Where 0=silence, 1=medium, 2=verbose

In an executable with a shebang line this is a little harder. This is the method I have found:

    #!/usr/bin/env ruby
    ##                      $VERBOSE
    ## -W0  NO Warnings     nil
    ## -W1  Quiet           false
    ## -W2  Verbose         true
    BEGIN { $VERBOSE = nil }

    #Rest of ruby script

The script can then be called directly with the warning level set:

    $ executable_ruby_script 


