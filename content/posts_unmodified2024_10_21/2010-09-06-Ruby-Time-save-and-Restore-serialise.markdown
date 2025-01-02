---
layout: post
title: "Ruby Time save and Restore (serialise)"
date: 2010-09-06 16:25:45 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
discuss_url: //67
url: //67/Ruby_Time_save_and_Restore_%28serialise%29
id: 67
---
One method to save a time and restore it correctly:

    def get_time_run
    ## File Access based on
    ## http://rubylearning.com/satishtalim/read_write_files.html
 
     if File.exists?('time.log') 
       File.open('time.log', 'r') do |f|  
          while line = f.gets  
             @last_run = Time.at(line.to_i)
          end  
       end 
     end
     #Nice default if anything above failed
     @last_run ||= Time.at(0) 
    end

    def set_run_time
       if File.exists?("run.time")
          File.delete("run.time")
       end
       File.open('time.log', 'w') do |f|  
          f.puts Time.now.to_i  
       end  
    end

Previously I had missed off the to_i but that meant when the time was loaded it was a string representation of it, quite a bit trickier to convert back into a time object.
