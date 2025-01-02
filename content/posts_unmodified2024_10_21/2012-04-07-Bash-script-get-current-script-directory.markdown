---
layout: post
title: "Bash script get current script directory"
date: 2012-04-07 13:45:37 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Command Line
- CSS
- Programming
discuss_url: //147
url: //147/Bash_script_get_current_script_directory
id: 147
---
Sometime a script needs to now the directory that it is executing from, the best solution for this is:

    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

Although the simpler version below should work for most cases the version above is preferred for shell portability.

    DIR=`dirname $0` 

The usage of this could be for creating shell scripts that a user can double click to execute or drag on to the terminal to execute, as the working directory could change. Uses the scripts folder means that if a user copies the script to a new project it will work in the new project rather than having absolute paths to the old project. 

    #!/bin/bash

    DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
    CSS_COLLATION=$DIR/screen.css

    #Clean File
    echo '' > $CSS_COLLATION

    #Append CSS
    cat $DIR/reset.css >> $CSS_COLLATION
    cat $DIR/960.css >> $CSS_COLLATION
 

[From StackOverflow][source]

[source]: http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
