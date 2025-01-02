---
layout: post
title: "Schwartzian Transform"
date: 2011-04-08 10:37:44 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Memory
- Performance
- Programming
- Ruby
- Perl
discuss_url: //98
url: //98/Schwartzian_Transform
id: 98
---
I recently heard about the Schwartzian transform, which is a sorting idiom from perl. It allows an array of objects to be efficiently sorted by any property. Part of the cleverness is the use of anonymous arrays which allows them to be garbage collected quickly. 

[Wikipedia][] has a detailed description, however the general form (in perl) is:

    @sorted = map  { $_->[0] }
              sort { $a->[1] cmp $b->[1] }
              map  { [$_, foo($_)] }
                  @unsorted;

A good history of it can be [read here][history].

My point of bring all of this up other than pointing out a cool sorting algorithm is that any <strong>ruby</strong> class including [Enumerable][] (Arrays, Hashes etc) has this built in with the [<strong>.sort_by</strong>][sort_by] method.



[history]: http://www.stonehenge.com/merlyn/UnixReview/col64.html
[Wikipedia]: http://en.wikipedia.org/wiki/Schwartzian_transform
[Enumerable]: http://ruby-doc.org/core/classes/Enumerable.html
[sort_by]: http://ruby-doc.org/core/classes/Enumerable.html#M001481
