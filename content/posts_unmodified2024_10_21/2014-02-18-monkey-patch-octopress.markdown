---
layout: post
title: "Monkey Patch Octopress"
date: 2014-02-18 19:46:55 +0000
comments: true
categories: Tech
tags:
- Web
- Octopress
- Ruby
---
Based on [post_filters by imathis](https://github.com/imathis/octopress/blob/master/plugins/post_filters.rb).

First Move the original method out the way with `alias_method`  then create a new method with the original name, calling the original now aliased method if required.

    module Jekyll
      class URL
        alias_method :old_sanitize_url, :sanitize_url
        def sanitize_url(in_url)
          old_sanitize_url(in_url).downcase
        end
      end
    end

This was used to build my [Octopress plugin octopress_url_downcase](https://github.com/morganp/octopress_url_downcase).
