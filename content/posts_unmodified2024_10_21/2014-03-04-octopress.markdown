---
layout: post
title: "Octopress, Pages and Custom Domain"
date: 2014-03-04 18:19:25 +0000
comments: true
categories: Tech
tags:
- Octopress
- Web
---
In your `sources` branch, which is the main branch for writing creating posts, create a `CNAME` file in the sources directory.

vim source/CNAME

    your-domain.co.uk

Then check-in and deploy

    git add source/CNAME
    rake deploy

Point your domain to github pages:

    A record pointing to 204.232.175.78

I also redirect www. to the non-www url

    CNAME record for www.example.com to example.com  

[Official Docs](http://octopress.org/docs/deploying/github/)
