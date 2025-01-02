---
layout: post
title: "Add about page to Octopress"
date: 2013-05-19 08:41:53 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Octopress
- Programming
- Web
discuss_url: //222
url: //222/Add_about_page_to_Octopress
id: 222
---
To add  static about page to octopress blog, assuming that octopress has been already setup:

Create the page from the command line:

    rake new_page["about"]

You can now edit the page at ./source/about/index.markdown which should look like:

    ---
    layout: page
    title: "about" 
    date: 2013-05-19 09:04
    comments: true
    sharing: true
    footer: true
    ---

Add the link to the site navigation menu.

Edit source/_includes/custom/navigation.html from :

    <ul class="main-navigation">
      <li><a href="{{ root_url }}/">Blog</a></li>
      <li><a href="{{ root_url }}/blog/archives">Archives</a></li>
    </ul>

To (adding about link):

    <ul class="main-navigation">
      <li><a href="{{ root_url }}/about">About</a></li>
      <li><a href="{{ root_url }}/">Blog</a></li>
      <li><a href="{{ root_url }}/blog/archives">Archives</a></li>
    </ul>
