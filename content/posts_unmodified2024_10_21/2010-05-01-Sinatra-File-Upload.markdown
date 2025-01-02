---
layout: post
title: "Sinatra File Upload"
date: 2010-05-01 07:54:03 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Sinatra
discuss_url: //23
url: //23/Sinatra_File_Upload
id: 23
---
A simple Sinatra web app to upload a single file. Also available as a [gist][], based on <http://pastie.caboo.se/134681>

[gist]: http://gist.github.com/386495

    require 'rubygems'
    require 'sinatra'
    
    get '/upload' do
       erb '<form action="upload" method="post" enctype="multipart/form-data" accept-charset="utf-8">
       <input type="file" name="uploaded_data" id="uploaded_data">
       <p><input type="submit" value="Continue"></p>
       </form>'
    end
    
    post '/upload' do
       FileUtils.mkdir_p('./Uploads/')
       FileUtils.mv(params[:uploaded_data][:tempfile].path, "./Uploads/#{params[:uploaded_data][:filename]}")
       erb 'Upload Complete'
    end
