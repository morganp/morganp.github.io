Title: Pelican New Post script
Date: 2025-01-03 16:44 
Category: Tech
Tags: python
Author: morganp
Status: published

In the aim of keeping the navigation of the Blog posts clean, I have limited my self to a few general categories, but remeberign them while editing in vim and not creating typos is a pain. Therefore I have added the category selection to my pyhton script for creating the new markdown files.

When running this file from the command line, top level of my pelican project, it first prompts for a category selection then requests The title of the post. The new file is created and correctly formated for a Pelican markdown post.


    #!/usr/bin/python3
    # coding=utf-8

    # CLI for creating a new markdown post

    import html

    from datetime import datetime

    # datetime object containing current date and time
    now = datetime.now()
     
    # dd/mm/YY H:M
    dt_string = now.strftime("%Y-%m-%d %H:%M")
    dt_string_simple = now.strftime("%Y-%m-%d")

    # Create dictionary of categories, ask for user selection.
    cat_dict = {1:"Cooking", 2:"Engineering", 3:"Home", 4:"Outdoor", 5:"Photography", 6:"Tech"}
    print( cat_dict )
    post_cat = input("Enter Post Category :")
    post_cat = int(post_cat)
    
    #Request title of blog post
    post_title = input("Enter Post Title : ")

    post_title = html.escape(post_title) # sanitize
    post_title_safe = post_title.replace(' ', '_')

    new_post_name = dt_string_simple + '_' + post_title_safe

    this_file_name = "./content/posts/"+new_post_name+".md"

    with open(this_file_name, "w") as file:
        file.write("Title: " + post_title + "\n")
        file.write("Date: %s \n" % dt_string)
        file.write("Category: %s\n" % cat_dict[post_cat])
        file.write("Tags: python\n")
        file.write("Author: morganp\n")
        file.write("Status: draft\n")
        file.write("<!--to publish change draft to published-->\n")

    print(this_file_name)
