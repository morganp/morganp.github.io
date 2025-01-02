---
layout: post
title: "Encoding::UndefinedConversionError - "
date: 2012-04-04 20:37:01 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- SASS
- Sinatra
- Web
discuss_url: //146
url: //146/Encoding%3A%3AUndefinedConversionError_-_
id: 146
---
Are you running into the following error

    Encoding::UndefinedConversionError - "\xE2" from ASCII-8BIT to UTF-8:

If you are using Ruby and SASS for your stylesheets then it might help to start your stylesheets with:

    @charset "UTF-8"


In my main sinatra app I had

    before do
      content_type 'text/html', :charset => 'utf-8'
    end

    get '/base.css' do
      sass :'stylesheets/base'
    end

Now the before route forces it to be utf-8 so stylesheets/base.sass also needs a charset defining:

    @charset "UTF-8"
    
    body
      font:
        family: Helvetica, Arial, sans-serif
    
    #head
      margin: 0
      padding: 1em
      background-color: #ccc

