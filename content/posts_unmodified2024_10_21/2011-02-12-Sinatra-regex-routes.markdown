---
layout: post
title: "Sinatra regex routes"
date: 2011-02-12 06:41:10 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Sinatra
discuss_url: //88
url: //88/Sinatra_regex_routes
id: 88
---
The routes for my site have been growing since adding pagination (/articles/older/) and tag filtering. As well as the small amount of logic for each route was getting duplicated. 

I have been experimenting with real regex routes, so far some thing like this looks like it could be a good solution:
 
    $items_per_page = 10
    get /^\/article(\/older(\/\d+)?)?(\/tag\/\w*)?\/?$/ do |pagination, page, tag|
    
    if pagination.nil?
       @offset = 0
      else
        if page.nil?
          @offset = $items_per_page
        else
          @offset = page.gsub(/^\//, "").to_i
      end

      if not tag.nil?
       tag.gsub!(/\/tag\//, "")
      end

      result = "Pagination #{@offset} <br  />"
      result << "Tag #{tag} <br  />"
      result << "captures #{ params[:captures] }"
      return result 
    end

This means the following routes will be handled:  
/article  
/article/  
/article/older/  
/article/older/10  
/article/tag/Ruby  
/article/older/10/tag/Ruby  
/article/older/tag/Ruby  


