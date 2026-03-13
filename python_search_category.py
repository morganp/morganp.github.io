#!/usr/bin/python3
# coding=utf-8

import html
post_path = "./content/posts/"

#with open(this_file_name, "w") as file:
#    file.write("Title: " + post_title + "\n")
#    file.write("Date: %s \n" % dt_string)
#    file.write("Category: Python\n")
#    file.write("Tags: python\n")
#    file.write("Author: morganp\n")

## 
# Use to filter posts in a particular category
#from os import listdir
#from os.path import isfile, join
#
#only_files = [f for f in listdir(post_path) if isfile(join(post_path,f))]

import glob
 
post_files = glob.glob(post_path + "*.markdown")

#print(post_files)

import os
import sys
import fileinput
import re

cat_dict = {1:"Cooking", 2:"Engineering", 3:"Home", 4:"Outdoor", 5:"Photography", 6:"Tech"}
print( cat_dict )
post_cat = input("Enter Post Category:")
post_cat = int(post_cat)
cat_find = cat_dict[post_cat]


i=0
for post_file in post_files:
  #if i < 3:
    #print(post_file)
    with open(post_file, 'r') as filein:
      file_data = filein.read()
      pattern = "Category: %s" % cat_find
      match = re.search(pattern, file_data)
      
      if (match) :
          print(post_file)
     
      
    #file_data = file_data.replace('tags: \-','supertags')
    #file_data = re.sub(r'\n- ([a-zA-Z0-9 ]*)',r' \1,', file_data, flags=re.M)
    #file_data = re.sub('categories:','Category:', file_data, flags=re.M)
    #file_data = re.sub('tagss:','Tags:', file_data, flags=re.M)
    
    # below: remove trailing comma on Category line
    #file_data = re.sub(r'Category: ([a-zA-Z0-9 ]*),$',r'Category: \1', file_data, flags=re.M)

    ## Need to remove the url line in header

    

    #with open(post_file+'modified', 'w') as fileout:
    #with open(post_file, 'w') as fileout:
    #  fileout.write(file_data)


    i=i+1

