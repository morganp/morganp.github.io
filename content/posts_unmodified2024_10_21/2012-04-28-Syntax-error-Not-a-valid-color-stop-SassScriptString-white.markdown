---
layout: post
title: "Syntax error: Not a valid color stop: Sass::Script::String: white"
date: 2012-04-28 19:02:50 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Bundler
- Gem
- Programming
- Ruby
- SASS
- Web
discuss_url: //156
url: //156/Syntax_error%3A_Not_a_valid_color_stop%3A_Sass%3A%3AScript%3A%3AString%3A_white
id: 156
---
After making a few updates to my site it stopped working after deploying. The issue was that the gem version of compass had not been tied down and the server was working with newer version.

The error was coming from this line in my sass file :

    $gradient = #FFFFFF // This get converted to  'white' in the error message
    background-image:         linear-gradient(to bottom, #{$gradient}, #{$back})

Again the error was:

    Syntax error: Not a valid color stop: Sass::Script::String: white

To fix the issue I had to revert back to  compass 0.10.6 

Reverting Compass
--

Bundler Gemfile `gem  "compass", "0.10.6"`  
then run `$ bundle update`

Or directly from the command line `gem install compass -v 0.10.6`    

Now run `gem list` and remove the newer versions ie  
`gem uninstall compass -v 0.12.1`

