---
layout: post
title: "gem install with out the docs"
date: 2010-04-10 14:11:26 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Gem
discuss_url: //13
url: //13/gem_install_with_out_the_docs
id: 13
---
When I install gems on my server I do not get any of the documentation which is normally 3-5 times larger than the gem itself. Installing gems with out docs can be done via 

    $ gem install --no-ri --no-rdoc gem_name 


Based this [blog post][source] I have created a ~/.gemrc so that it does the no docs automatically.

    :update_sources: true
    :bulk_threshold: 1000
    :sources: 
    - http://rubygems.org
    - http://gems.github.com
    gem: --no-ri --no-rdoc
    :verbose: true
    :benchmark: false
    :backtrace: false

[source]: http://bparanj.blogspot.com/2008/11/how-to-install-gem-without-rdoc-or-ri.html
