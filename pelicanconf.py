#!/usr/bin/env python
# -*- coding: utf-8 -*- #
import markdown

AUTHOR = 'morganp'
SITENAME = 'Lizard-Spock'
SITEURL = 'https://lizard-spock.co.uk'
TIMEZONE = 'Europe/London'
DEFAULT_LANG = 'en'

PATH = 'content'
OUTPUT_PATH = 'output'

# When sub app of github url
RELATIVE_URLS = True
SUMMARY_MAX_LENGTH = 20

# --------------8<---------------------
# Theme

#THEME = 'simple-bootstrap'
# https://github.com/getpelican/pelican-themes/tree/master/pelican-bootstrap3

# --------------8<---------------------
# Files and content

# Don't try to turn HTML files into pages
READERS = {'html': None}

# This will look for a directory img/ 
# inside the directory content/
# The contents of img/ will be available at 
# {{ SITEURL }}/img
# 'posts' is a static path as well as ARTICLE_PATHS so that folder-style posts
# can keep their images beside the markdown and still serve from a folder URL.
# Article sources are skipped by STATIC_EXCLUDE_SOURCES, which defaults to True.
STATIC_PATHS = ['images', 'pdf', 'models', 'extra', 'drum_rudiments', 'wavedrom-editor', 'posts']

# Defaults plus macOS clutter and the extensionless Jekyll leftover at
# content/posts/_, none of which should be copied into the built site.
IGNORE_FILES = ['**/.*', '.DS_Store', '_']
EXTRA_PATH_METADATA = {'extra/custom.css': {'path': 'static/custom.css'}}
STYLESHEET_URL = '/static/custom.css'

# If we want to create static pages,
# we should put them in content/pages
PAGE_PATHS = ['pages']

# If we want to create blog posts (articles),
# we should put them in content/posts
ARTICLE_PATHS = ['posts']


## Adding template pages creating /tag/index.html from tags.html
TEMPLATE_PAGES = {'tags.html':       'tag/index.html',
                  'categories.html': 'category/index.html',
                  'pages/CNAME': 'CNAME'}

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

# ./content/pages/*.md become links in menu
DISPLAY_PAGES_ON_MENU = True
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
DEFAULT_PAGINATION = False
PAGINATED_TEMPLATES = {'index': 10, 'tag': None, 'category': None, 'author': None}

PLUGINS = [
    'pelican.plugins.wavedrom_generator',
    'pelican.plugins.fsm_renderer',
    'pelican.plugins.fretboard',
]

FRETBOARD_CACHE_PATH = 'content/images/fretboard'
FRETBOARD_CACHE_URL  = '/images/fretboard'

THEME_TEMPLATES_OVERRIDES = ['templates']

# Categories grouped behind a single "Tech" dropdown in the nav. Anything not
# listed here stays as a top-level nav entry.
TECH_CATEGORIES = [
    'Engineering',
    'Hardware & Homelab',
    'Programming',
    'Unix & Tools',
]

WEBAPPS = [
    ('Drum Rudiments', '/drum_rudiments/'),
    ('Wavedrom Editor', '/wavedrom-editor/'),
    ('Fretdrom Editor', '/fretdrom-editor/'),
    ('AMBA Explorer', '/amba-explorer/'),
    ('OpenSCAD GUI', '/openscad-gui/'),
    ('STEM Academy', '/stem-academy/'),
]

SOCIAL = [
    ('Buy Me a Coffee', 'https://buymeacoffee.com/lizardspock'),
]
