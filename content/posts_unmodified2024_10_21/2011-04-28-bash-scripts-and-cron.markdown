---
layout: post
title: "bash scripts and cron"
date: 2011-04-28 20:01:13 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Programming
discuss_url: //103
url: //103/bash_scripts_and_cron
id: 103
---
I have not fully read it but it looks like this is a [good guide to bash scripting][bashguide]. A few things that normally catch me out trying to load modules inside a script, but they fail with:

    > module: command not found

This is due to the module system not being loaded. For Linux/Unix systems adding the 3rd line below should fix the issue.

    #!/bin/bash
    
    . /usr/share/modules/init/bash
    module load something

NB: Not sure how to do this on Mac OS X

The Second bash scripting issue that trips me up is when adding to cron.

cron or crontab is a way to run scripts at regular intervals, however by default it runs in a minimal environment. This means that a script which executes correctly in your terminal may not work as expected when entered in cron.

Solution 1
----------

    #!/bin/bash
    source ~/.bashrc

    echo "The rest of the script"

Sourcing your bashrc in the script while this works it requires the script to be written based on how it will be deployed. Solution 2 fixes the crontab for the environment it will run in.

Solution 2
----------

edit the crontab 

    $ crontab -e

From this:

    * * * * * /path/to/script

to this:

    * * * * * /bin/bash -l -c '/path/to/script'

-l loads the full environment  
-c tells bash that there is a script to execute

[bashguide]: http://mywiki.wooledge.org/BashGuide
