#!/usr/bin/env python
# -*- coding: utf-8 -*- #
import markdown

AUTHOR = 'morganp'
SITENAME = 'Pelican Trial'
SITEURL = 'http://lizard-spock.co.uk/pelican_test'
TIMEZONE = 'Europe/London'
DEFAULT_LANG = 'en'

PATH = 'content'
OUTPUT_PATH = 'output'

# When sub app of github url
RELATIVE_URLS = True
SUMMARY_MAX_LENGTH = 20

# --------------8<---------------------
# Theme

THEME = 'simple-bootstrap'
# https://github.com/getpelican/pelican-themes/tree/master/pelican-bootstrap3

# --------------8<---------------------
# Files and content

# Don't try to turn HTML files into pages
READERS = {'html': None}

# This will look for a directory img/ 
# inside the directory content/
# The contents of img/ will be available at 
# {{ SITEURL }}/img
STATIC_PATHS = ['img']

# If we want to create static pages,
# we should put them in content/pages
PAGE_PATHS = ['pages']

# If we want to create blog posts (articles),
# we should put them in content/posts
ARTICLE_PATHS = ['posts']

# -------------8<----------------------
# Add an app with multiple files
#
# Look for files in example_app/ directory,
# make them available on the site at /app
"""
EXTRA_TEMPLATES_PATHS = []
TEMPLATE_PAGES = {}

EXTRA_TEMPLATES_PATHS.append('example_app') # This is where these files live
#TEMPLATE_PAGES[filename]      = /final/site/path/filename
TEMPLATE_PAGES['my_app.html'] = 'app/index.html'
TEMPLATE_PAGES['app.js']      = 'app/app.js'
TEMPLATE_PAGES['app.css']     = 'app/app.css'
TEMPLATE_PAGES['data.json']   = 'app/data.json'
"""

# --------------8<---------------------
# idk just some dumb stuff

DISPLAY_PAGES_ON_MENU = False
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
DEFAULT_PAGINATION = False
