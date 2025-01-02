---
layout: post
title: "Sinatra blog retrieving next and previous ids"
date: 2010-04-09 10:13:17 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Sinatra
discuss_url: //12
url: //12/Sinatra_blog_retrieving_next_and_previous_ids
id: 12
---
When displaying blog/articles it is often nice to have previous and next posts. Simply -1 +1 from the current post.id is not enough because posts could be deleted or marked as private. These requirements should also be added into the :conditions statement. Below is a nice way I found of finding the previous and next ids.

    get '/article/:id/?' do
       prev_post = Posts.last( :conditions => ["id < ?", params[:id]])
       next_post = Posts.first(:conditions => ["id > ?", params[:id]])
       if not prev_post.nil?
           @prev_post_id =  prev_post.id
       end
       if not next_post.nil?
          @next_post_id = next_post.id
       end
    
       @posts = Posts.first(:conditions => ["id = ?", params[:id]])
      
      erb :'blog/blog_one'
    end

