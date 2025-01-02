---
layout: post
title: "Ruby Memory Issue on Web Faction"
date: 2010-05-03 13:19:02 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Sinatra
- Ruby
- Performance
- Programming
- WebFaction
discuss_url: //25
url: //25/Ruby_Memory_Issue_on_Web_Faction
id: 25
---
I while ago I made [a post][ruby19] about installing ruby 1.9 on my webfaction shared host. They then pointed out to me that if I had gone into my webapps/passanger/bin folder I would have seen that it does not use the ruby and gems on my default path but is free to point to a different version.

Lately I have been having some memory issue with my ruby sinatra apps. This site normally idles under 20MB but when hit with multiple visitors peaks at over 190MB which is way outside of my allowed usage (80MB), Webfaction have been very good in giving me some lee-way until I have resolved the issue.

From reading [this article on passenger architecture][passenger] I have discovered that standard ruby (1.8 and 1.9) do not work that well with passengers spawning processors and the [Ruby Enterprise][re] is recommended. Ruby Enterprise 1.8 is standard with webfaction. I have therefore reverted back to the standard.

I have got a [small ruby script][memoryusage] on github which can be used to monitor memory usage. It has been moded from the original [gist][] I found it on to allow it to run on Mac OS X. NB: the script uses around 3MB of memory to run.

[This blog post][memprint] gives a good overview of the memory footprints of different ruby web frameworks. NB: On my development machine I have noted that ruby 1.8 took 22MB to run my app but increased quickly to 30MB when serving pages and ruby 1.9 took 45MB but did not increase as sharply while serving pages.

Update:
This post has served as a test with Ruby Enterprise. I now when posting (assuming from the twitter feed) i get a few hits, which cause 5 Rack processes to be spawned all taking 25MB. This is still not ideal but is slightly more controlled than ruby 1.9. when restarting the server it drops back down to 18MB (no rack process) which suggests all the traffic was in a very short space of time and that the rack processes would have been closed as they timed out, they stay open for a while so to avoid delay when being hit by frequent requests.
 
[ruby19]: http://amaras-tech.co.uk/people/morgan/article/14

[passenger]: http://www.modrails.com/documentation/Architectural%20overview.html

[re]: http://www.rubyenterpriseedition.com/

[memoryusage]: http://github.com/morganp/munkymorgy_scripts_generic/blob/master/memory_usage.rb

[gist]: http://gist.github.com/290988

[memprint]: http://adamblog.heroku.com/past/2008/6/10/sinatra_my_new_favorite_microframework/
