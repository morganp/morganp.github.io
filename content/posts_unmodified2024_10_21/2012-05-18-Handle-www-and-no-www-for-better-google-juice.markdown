---
layout: post
title: "Handle www. and no-www for better google juice"
date: 2012-05-18 23:00:39 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Bundler
- Performance
- Programming
- Rack
- Ruby
- Sinatra
- Web
discuss_url: //163
url: //163/Handle_www._and_no-www_for_better_google_juice
id: 163
---
There was an interesting post on hacker news recently, [safeshepherd suddenly fell off the google][1] for their own name. The [comments][2] had some good answers especially the first by a google employee. 

The gist of it is that if you have https:// and http:// and www.domain.com and domain.com google sees 4 versions of you site. It will pick one of them as the main site each time it ranks your site. This can change every, effecting the ranking, as it looks like duplicated content.

For Sinatra there is a nice bit of middle were called [rack-no-www][] which adds the redirect for you.

Add to you gem file

    gem  "rack-no-www",  "~> 0.0.2", :require => 'rack/no-www'

Or just `gem install rack-no-www`

Usage in a basic Sinatra App (app.rb)
 
    require 'sinatra'
    require 'rack/no-www'

    use Rack::NoWWW
    
    get '/' do
      'Helloworld'
    end

Run with `ruby app.rb` With web browser view localhost:4567. If that is working then you should find www.localhost:4567 redirects back to localhost:4567


[1]: http://blog.safeshepherd.com/post/23218902229/google-just-nerfed-us-a-venture-backed-startup
[2]: http://news.ycombinator.com/item?id=3987935

[rack-no-www]: https://github.com/logicaltext/rack-no-www
