---
layout: post
title: "list_temp_files script"
date: 2012-02-20 12:18:21 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Command Line
- Programming
discuss_url: //139
url: //139/list_temp_files_script
id: 139
---
A simple script for finding temp files from the current directory and below. I often run this before adding a new project to a revision control system to ensure temp files do not get added into the repo.

    #!/bin/sh
    
    echo "Searching for temp local files/directories"
    #vim accidental saves
    find . -name "1" -type f 
    
    #Other Temp files
    find . -name "*.log" -type f 
    find . -name "*.key" -type f
    find . -name "*.swp" -type f 
    find . -name "results" -type d 
    find . -name "waveforms" -type d  
    
    echo "Searching for temp links"
    find . -name "results" -type l 
    find . -name "waveforms" -type l 
    
    #Accidental checkins
    find . -name "*.log" -type l
    find . -name "*.key" -type l
    find . -name "*.swp" -type l


