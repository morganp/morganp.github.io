Title: Pelican Site add Tags and Categories list
Date: 2025-01-02 15:39 
Category: Tech
Tags: python, pelican
Author: morganp

I think it improves website usability when they are navigatable via the URL.

For example when viewing Posts under the caetegory 'Tech' ie https://lizard-spock.co.uk/category/tech.html, 

removing the category and viewing  https://lizard-spock.co.uk/category/ should list the possible categories.



The page is created by pelican but it is placed as :

    https://lizard-spock.co.uk/categories.html
 
Not

    https://lizard-spock.co.uk/category/index.html

To remedy this, modify your pelicanconf.py Adding in some page mappings.

    ## Adding template pages creating /tag/index.html from tags.html
    TEMPLATE_PAGES = {'tags.html': 'tag/index.html'}


The Above takes the tags.html template and makes it available via example.com/tag




