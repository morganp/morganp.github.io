#!/usr/bin/python
# coding=utf-8

import html
# CLI for creating a new markdown post


from datetime import datetime

# datetime object containing current date and time
now = datetime.now()
 
# dd/mm/YY H:M
dt_string = now.strftime("%Y-%m-%d %H:%M")
dt_string_simple = now.strftime("%Y-%m-%d")

post_title = input("Enter Post Title : ")
post_title = html.escape(post_title) # sanitize
post_title = post_title.replace(' ', '_')

new_post_name = dt_string_simple + '_' + post_title


with open("./content/posts/"+new_post_name+".md", "w") as file:
    file.write("Title: " + post_title + "\n")
    file.write("Date: %s \n" % dt_string)
    file.write("Category: Python\n")
    file.write("Tages: python\n")
    file.write("Author: morganp\n")
