---
layout: post
title: "Installing the ruby gem twitter on webfaction"
date: 2010-04-12 10:33:21 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Gem
- WebFaction
- Twitter
discuss_url: //14
url: //14/Installing_the_ruby_gem_twitter_on_webfaction
id: 14
---
[Update]  
As this is a long post I am putting this update at the top. If you just want to install gems that require a newer version of RubyGems please see the comments at the bottom. I was originally using the wrong gem binary, I should have cd into the webapps directory and found the ruby ee gem was actually uptodate.

[Original]  

I have been playing with the [twitter][twit] api via the gem [twitter][twitgem]. This worked fine with my local development version but ran into a few problems when trying to run it on my [webfaction][webfaction] production site. The main problem with [webfaction][webfaction] is that they have not upgraded the gem to the latest version. To get a version I am allowed to upgrade requires me to install/compile a version of ruby.
Since I was installing it I have decided to go with Ruby 1.9, NB: I still had to upgrade gem afterwards.

This is the how I worked through installing it. 

    $ gem install twitter
    > ERROR:  Error installing twitter:
    >      oauth requires RubyGems version > 1.3.1
    > Updating class cache with 1488 classes...

Make list of current gems as will need to reinstall

    $ cd ~/bin
    $ gem list

Save output of gems and location and version of ruby

    $ ruby --version > old_ruby_webfaction.txt
    $ which ruby >> old_ruby_webfaction.txt
    $ gem env >> old_ruby_webfaction.txt
    $ gem list >> old_ruby_webfaction.txt

Download ruby tar and unpack

    $ wget ftp://ftp.ruby-lang.org/pub/ruby/1.9/ruby-1.9.1-p376.tar.gz    
    $ tar -xzf ruby-1.9.1-p376.tar.gz
    $ rm ruby-1.9.1-p376.tar.gz


Compile / Install Ruby to ~/bin (for all the configure options you can run ./configure --help)

    $ cd ruby-1.9.1-p376 
    $ ./configure --prefix=$HOME
    $ make
    $ make test
    $ make install


Check new version of ruby is picked up

    $ ruby --version
    > ruby 1.9.1p376 (2009-12-07 revision 26041) [i686-linux]

if not paths are incorrect, this is in my ~/.bashrc

    PATH=$HOME/bin:$PATH
    export PATH

Clean up, this directory will be nealry 200 MBs

    $ rm -rf ~/bin/ruby-1.9.1-p376

I mentioned this earlier gem 1.3.1 is still the default with ruby 1.9

    $ gem --version 
    > 1.3.1

We will now have permission to upgrade it.

    $ gem install rubygems-update
    $ gem update --system
    
    $ gem --version
    > 1.3.6

Now back to the original problem installing the twitter gem

    $ gem install twitter

Seems to be working.

Now review old_ruby_webfaction.txt

    $ cd ~/bin
    $ cat old_ruby_webfaction.txt

Install all the gems you require (gem install x)

Once you have the site up and running on ruby 1.9 you may wish to remove the gems from the old location to save disk space.
For me the default location of gems was ~/.gem/ruby/1.8 but the command gem env should have saved it in to your old_ruby_webfaction.txt.

Since this install of ruby is entirely writeable by you the default location is probably being used for me this is '~/lib/ruby/gems/1.9.1' but again gem env should tell you the default location.

Passenger is the web service that runs Sinatra and Rails applications, we now need it to use our version of ruby.

    $ pwd
    /home/username/webapps/passenger/gems/bin
    $ ll

    lrwxrwxrwx  1 morgy morgy  30 Mar 13 12:37 erb -> /usr/local/ruby1.8.7ee/bin/erb
    lrwxrwxrwx  1 morgy morgy  30 Mar 13 12:37 gem -> /usr/local/ruby1.8.7ee/bin/gem
    lrwxrwxrwx  1 morgy morgy  30 Mar 13 12:37 irb -> /usr/local/ruby1.8.7ee/bin/irb
    -rwxr-xr-x+ 1 morgy morgy 409 Mar 13 12:37 passenger-config
    -rwxr-xr-x+ 1 morgy morgy 425 Mar 13 12:37 passenger-install-apache2-module
    -rwxr-xr-x+ 1 morgy morgy 423 Mar 13 12:37 passenger-install-nginx-module
    -rwxr-xr-x+ 1 morgy morgy 419 Mar 13 12:37 passenger-make-enterprisey
    -rwxr-xr-x+ 1 morgy morgy 415 Mar 13 12:37 passenger-memory-stats
    -rwxr-xr-x+ 1 morgy morgy 415 Mar 13 12:37 passenger-spawn-server
    -rwxr-xr-x+ 1 morgy morgy 409 Mar 13 12:37 passenger-status
    -rwxr-xr-x+ 1 morgy morgy 414 Mar 13 12:37 passenger-stress-test
    -rwxr-xr-x+ 1 morgy morgy 384 Mar 13 12:36 rackup
    -rwxr-xr-x+ 1 morgy morgy 382 Mar 13 12:36 rake
    lrwxrwxrwx  1 morgy morgy  31 Mar 13 12:37 rdoc -> /usr/local/ruby1.8.7ee/bin/rdoc
    lrwxrwxrwx  1 morgy morgy  38 Mar 13 12:37 ree-version -> /usr/local/ruby1.8.7ee/bin/ree-version
    -rwxr-xr-x+ 1 morgy morgy  92 Mar 13 12:37 restart
    lrwxrwxrwx  1 morgy morgy  29 Mar 13 12:37 ri -> /usr/local/ruby1.8.7ee/bin/ri
    lrwxrwxrwx  1 morgy morgy  31 Mar 13 12:37 ruby -> /usr/local/ruby1.8.7ee/bin/ruby
    -rwxr-xr-x+ 1 morgy morgy 144 Mar 13 12:37 start
    -rwxr-xr-x+ 1 morgy morgy 130 Mar 13 12:37 stop
    lrwxrwxrwx  1 morgy morgy  33 Mar 13 12:37 testrb -> /usr/local/ruby1.8.7ee/bin/testrb

Now implement the move to the new version of ruby with the new gems

    $ mv erb erb_old
    $ ln -s /home/`whoami`/bin/erb erb
    $ mv gem gem_old
    $ ln -s /home/`whoami`/bin/gem gem
    $ mv irb irb_old
    $ ln -s /home/`whoami`/bin/irb irb
    $ mv rdoc rdoc_old 
    $ ln -s /home/`whoami`/bin/rdoc rdoc
    $ mv ri ri_old
    $ ln -s /home/`whoami`/bin/ri ri
    $ mv ruby ruby_old
    $ ln -s /home/`whoami`/bin/ruby ruby 
    $ mv testrb testrb_old
    $ ln -s /home/`whoami`/bin/testrb testrb

Restart server 

    $ ~/webapps/passenger/restart

Deploy you web app using twitter gam and everything should be working!

Summary
=======

Install local Ruby 1.9  
Upgrade new gem from 1.3.1 to 1.3.6  
Install required gems  
Change Ruby/Gem version used by Passenger for Sinatra and Rails Web apps  

[webfaction]: http://www.webfaction.com?affiliate=morgy
[twit]: http://twitter.com/amarastech
[twitgem]: http://twitter.rubyforge.org/

