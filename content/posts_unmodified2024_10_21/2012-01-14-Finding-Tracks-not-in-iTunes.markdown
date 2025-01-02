---
layout: post
title: "Finding Tracks not in iTunes"
date: 2012-01-14 18:19:45 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Automation
- Audio
discuss_url: //134
url: //134/Finding_Tracks_not_in_iTunes
id: 134
---
After switching my Audio ripper ([Max][]) accidentally to 'AAC Low Delay' rather than plain 'AAC' I realised too late after about 20-30cd rips that they were not appearing in iTunes.

I also convert to flac to converting to the correct format from source is still relatively easy. Finding which track are in my iTunes folder but not in the iTunes library is a little bit more tricky. Well it was going to be until I found [this Dougs Script][dscript]. 

I did not have to instal any script for this just ran the app insdie the download for 'Music Folder Files Not Added v3.0'. My iTune folder is in the default location so I just had to press 'find' and it took around a minute to list all the music tracks I had but iTunes had not added to its library.

Working my way through the list recreating the tracks in the correct AAC format, just adding the 'iTunes Music' folder to iTunes after every ablum fix and hitting 'find' in Dougs app to refresh the list.  

Easy, almsot got a ruby version of it working but only got so far:

    gem install 'itunes-library'

The Script:
    
    require 'itunes/library'

    path       = File.expand_path( "~/Music/iTunes/iTunes Music" )
    itunes_lib = File.expand_path( "~/Music/iTunes/iTunes Library.xml" )
    library    = ITunes::Library.load( itunes_lib )

    puts  "#{library.music.tracks.size} Tracks have been loaded"

    files = Dir.glob( File.join(path, '**', '*.m4a'  ) )
    
    files.each do |music_file|
      music_file_nice = music_file.dup
      music_file.gsub!(' ', '%20')
      music_file.gsub!('#', '%231')
      #music_file.gsub!('´', '%C2%B4')

      #This comes last so it the # does not get replace
      music_file.gsub!('&', '&') 
  
      #Correcting filename prefix / location
      music_file.gsub!('/Users/morgy/Music', 'file://localhost/Volumes/Queeg500TimeM')

      found = []
      #found = library.music.tracks.keep_if { |t| t.to_hash['Location'] == music_file }
      library.music.tracks.each { |t| 
        if t.to_hash['Location'] == music_file
          found << t
        end
      }

      if found.empty? 
        puts
        puts "MISSING #{music_file_nice}"
      end

    end

[Max]: http://sbooth.org/Max
[dscript]: http://dougscripts.com/itunes/scripts/ss.php?sp=musicfolderfilesnotadded2
