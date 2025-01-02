---
layout: post
title: "User selectable stylesheets (Using Sinatra)"
date: 2012-03-29 21:49:23 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- CSS
- Design
- Programming
- SASS
- Sinatra
- Web
discuss_url: //143
url: //143/User_selectable_stylesheets_%28Using_Sinatra%29
id: 143
---
Working on my site design I thought it would be nice to have user selectable stylesheets, say a black text on white background or white text on black background. Once I had this working in development mode I ran into the problem with the stylesheet being cached. 

In my implementation the user sets a cookie by visiting a url and being redirected back to the original page. The routing then returned different content for the /stylesheet/screen.css based on the cookie. 

From my [Sinatra][] routes:

    get '/set_css/:style' do
       ## Set style with /set_css/light?ref=/article
      response.set_cookie("style", { :value => params[:style], :path => '/'} ) 

      if params[:ref].nil? or params[:ref] == '' 
        redirect '/'
      else
        redirect params[:ref]
      end
    end

The CSS routes, using sass for rendering

    get '/stylesheets/screen.css' do
      content_type 'text/css', :charset => 'utf-8'
      response['Expires'] = (Time.now + 60*60*24*356).httpdate
      if request.cookies['style'] == 'light'
        sass(:"stylesheets/light_screen" ) 
      else
        sass(:"stylesheets/dark_screen" ) 
      end
    end

The problem mentioned earlier is that the header is set to cache the page for a year. This means that the user would need to force a full webpage refresh. This does not happen automatically using the route which sets the cookie and redirect.

An easy solution to for this is using the cookie to directly load a different named stylesheet. Each stylesheet will get cached but they are different assets to the browser. For my web app I move the if statment into layouts.erb. 

Stylesheet routes back to:

    get '/stylesheets/:name.css' do
      content_type 'text/css', :charset => 'utf-8'
      response['Expires'] = (Time.now + 60*60*24*356).httpdate
      sass(:"stylesheets/#{params[:name]}" ) 
    end

Inside my layout.erb

    <head>
      <% if request.cookies['style'] == 'light' -%>
      <link href="/stylesheets/light_screen.css" rel="stylesheet" type="text/css" media="screen, projection"/>
      <% else -%>
      <link href="/stylesheets/dark_screen.css" rel="stylesheet" type="text/css" media="screen, projection"/>
      <% end -%>
     </head>

The style selection menu:

    <ul>
      <li><a href="/set_css/light?ref=<%=request.fullpath%>">Light</a></li>
      <li><a href="/set_css/dark?ref=<%=request.fullpath%>">Dark</a></li>
    </ul>

[Sinatra]: http://www.sinatrarb.com/
