Title: Modify Pelican theme
Date: 2025-01-02 16:53 
Category: Tech
Tags: python, pelican
Author: morganp

First figure out which theme you are using.
List installed themes via:

    % pelican-themes -l
    simple
    notmyidea

pelicanconf.py does not set a THEME, therfore defaulting to notmyidea.

The template locaions are (update your python version as appropriate):

    cd venv/lib/python3.13/site-packages/pelican/themes/notmyidea/templates

At a minimum a theme must contain these files, which could be altered in your local copy of the theme.

    └── templates
        ├── archives.html         // to display archives
        ├── period_archives.html  // to display time-period archives
        ├── article.html          // processed for each article
        ├── author.html           // processed for each author
        ├── authors.html          // must list all the authors
        ├── categories.html       // must list all the categories
        ├── category.html         // processed for each category
        ├── index.html            // the index (list all the articles)
        ├── page.html             // processed for each page
        ├── tag.html              // processed for each tag
        └── tags.html             // must list all the tags. Can be a tag cloud.


