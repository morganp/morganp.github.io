---
layout: post
title: "Installing Ruby Enterprise on Mac OS X"
date: 2010-05-04 11:13:48 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Ruby
- Performance
discuss_url: //26
url: //26/Installing_Ruby_Enterprise_on_Mac_OS_X
id: 26
---
[Download ruby enterprise][rubyee] and follow instructions on page. The exact commands I used are:

    $ cd ~/bin
    $ wget http://rubyforge.org/frs/download.php/68719/ruby-enterprise-1.8.7-2010.01.tar.gz
    $ tar xzvf ruby-enterprise-1.8.7-2010.01.tar.gz
    $ cd ruby-enterprise-1.8.7-2010.01
    $ rm -rf ../ruby-enterprise-1.8.7-2010.01.tar.gz
    $ ./installer
 
I installed to /Users/me/bin/ruby-ee-1.8.7

    $ cd /Users/me/bin/ruby-ee-1.8.7
    $ rm -rf ~/bin/ruby-enterprise-1.8.7-2010.01/

Add this to your ~/.bashrc

    #Ruby Enterprise 1.8.7
    export PATH=~/bin/ruby-ee-1.8.7/bin:$PATH

On with the install (of Passenger)

    ~/bin/ruby-ee-1.8.7/bin/passenger-install-nginx-module

I chose option 1, to get nginx installed for me, I chose /Users/me/bin/nginx for the location.

Start the service

    $ sudo ~/bin/nginx/sbin/nginx

For help and reloading

    $ sudo ~/bin/nginx/sbin/nginx -h
    $ sudo ~/bin/nginx/sbin/nginx -s reload

Visit 127.0.0.1 in you rbrowser and the default screen should be there.
The web application that it is loading is set in:

    ~/bin/nginx/conf/nginx.conf

I added in a root to my Sinatra application that I have been working on:

    server {
        listen       80;
        server_name  localhost;
        root /Users/morgy/Documents/Code/Amaras-Site/public;   # <--- be sure to point to 'public'!
        passenger_enabled on;
    }

This then returned a 403 error...
Still a little work todo will post update on resolving this.

\[Update\]
I forgot that root had to point to the public folder inside the rack (Sinatra) application. I know there is a big comment there saying make sure but I just read that to be a permissions issue rather than the more literal a folder called public.


[rubyee]: http://www.rubyenterpriseedition.com/download.html
