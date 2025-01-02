---
layout: post
title: "Webfaction new user with access to their own site"
date: 2010-04-28 09:24:58 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- WebFaction
discuss_url: //21
url: //21/Webfaction_new_user_with_access_to_their_own_site
id: 21
---
With [Webfaction][webfaction] you can create new users with there own home area but there is no straight forward way to host their site.

There is a posted method where the site is hosted in YOUR home/webapps directory, but that requires you reset your permissions every time you create a new site and if you forget there could be a security hole.

Hosting the site in THEIR home directory requires you to set permissions in there directory so YOU can see it. This is much safer if all goes wrong the site does not have permission to be displayed rather than compromising your new site.

Create new user with bash login via with [Web interface][panel] 

set password, as this can be tricky getting a random string a cheat is to do:

    echo "some random string" | md5

Choose 8 or more characters for the password.

SSH login as normal 

    ssh user@user.webfactional.com

then
 
    su new_user
    cd ~
    mkdir myweb.com

then set  

    setfacl -m u:nginx:rx ~
    setfacl -R -m u:nginx:rx myweb.com/
    
    setfacl -m u:apache:rx ~
    setfacl -R -m u:apache:rx myweb.com/
    
    setfacl -m u:Your_Username:rx ~
    setfacl -R -m u:Your_Username:rx myweb.com/


Back to [webfaction][] main control panel and create a new app ( symbolic link to PHP/static )

The info section for this needs to be:
/home/new_user/myweb.com

NB: currently only works with apache not nginx


[panel]: http://panel.webfaction.com
[webfaction]: http://www.webfaction.com/?affiliate=morgy
