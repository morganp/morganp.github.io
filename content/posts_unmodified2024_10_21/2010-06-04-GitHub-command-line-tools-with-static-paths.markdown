---
layout: post
title: "GitHub command line tools with static paths"
date: 2010-06-04 23:19:58 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Programming
discuss_url: //35
url: //35/GitHub_command_line_tools_with_static_paths
id: 35
---
I have written a few command line tools in ruby which I use to perform file system maintenance. Mainly sorting files and applying standard renames, because the the folders I want to sort are always in the same location I do not want to have to remember to run the command in the correct directory so I add the paths explicitly. This creates a problem with uploading to [GitHub][] as other people would then need to modify the script. 

Here is a short example of how you can get around it using Environment Variables

    #!/usr/bin/env ruby
    ## Command Line tools can now be portable while working on static folders.

    if ENV['MEDIA_FOLDER'].nil?
       puts "Add this to ~/.bashrc"
       puts "Or Windows variables"
       puts "export MEDIA_FOLDER='[\"/user/name/Movies\", \"/user/name/TV Shows\"]'"
    else
       puts ENV['MEDIA_FOLDER']
    end

NB: when using the variables remember that it is a string and not an array. Convert to ruby Array by calling eval on it.

    eval(ENV['TEMP_FILES']).each do |x|
       puts x
    end


[GitHub]: http://github.com/morganp
