---
layout: post
title: "Benchmark your website for load times."
date: 2010-07-27 16:09:53 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Command Line
- Linux
- Memory
- nginx
- OS X
- Performance
- Programming
- Sinatra
- WebFaction
- Web
discuss_url: //57
url: //57/Benchmark_your_website_for_load_times.
id: 57
---
I have been wondering how to do this for a while and accidentally discovered it while perusing [this heroku page][source]. ab is the ApacheBench marking tool, it lets you set how many requests (for better averaging) and how many concurrent requests (for load testing) to send to your website. ab id installed by default on most unix/linux/mac os x.

50 requests 2 at atime

    $ ab -c 2 -n 50 http://amaras-tech.co.uk/

Outputs:
 
    This is ApacheBench, Version 2.3 <$Revision: 655654 $>
    Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
    Licensed to The Apache Software Foundation, http://www.apache.org/

    Benchmarking amaras-tech.co.uk (be patient).....done
    
    
    Server Software:        nginx
    Server Hostname:        amaras-tech.co.uk
    Server Port:            80

    Document Path:          /
    Document Length:        0 bytes
    
    Concurrency Level:      2
    Time taken for tests:   9.951 seconds
    Complete requests:      50
    Failed requests:        0
    Write errors:           0
    Non-2xx responses:      50
    Total transferred:      11400 bytes
    HTML transferred:       0 bytes
    Requests per second:    5.02 [#/sec] (mean)
    Time per request:       398.030 [ms] (mean)
    Time per request:       199.015 [ms] (mean, across all concurrent requests)
    Transfer rate:          1.12 [Kbytes/sec] received

    Connection Times (ms)
                  min  mean[+/-sd] median   max
    Connect:      146  162  16.7    158     214
    Processing:   149  229 198.3    159    1113
    Waiting:      148  228 198.2    159    1112
    Total:        298  392 198.0    328    1262
    
    Percentage of the requests served within a certain time (ms)
      50%    328
      66%    343
      75%    351
      80%    360
      90%    612
      95%    961
      98%   1262
      99%   1262
     100%   1262 (longest request)

[source]: http://docs.heroku.com/performance
