---
layout: post
title: "Ruby Regular Expressions Lookahead / Lookbehind"
date: 2010-09-07 01:39:28 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Gem
- Programming
- Ruby
- Regex
discuss_url: //68
url: //68/Ruby_Regular_Expressions_Lookahead_%2F_Lookbehind
id: 68
---
I recently discovered a feature of regular expressions called lookahead. This means for a match the lookahead must exist but it does not become part of the matched string.
NB: (group) print first group with \1

    "123456".gsub(/(\d\d\d)/, '\1,')
    123,456,

Now with lookahead

    "123456".gsub(/(\d\d\d)(?=\d)/, '\1,')
    123,456

There are 2 types of lookahead

    match (?=x)
    not-match (?!x)

Ruby 1.8.x does not support these by default but by using [Oniguruma][] which is the default regex engine in Ruby 1.9.x you can also use lookbehind expressions.
 
    match (?<=x)
    not-match (?<!x)

Example not using lookbehind

     "http://h:5/".gsub(/:/,'=>')
     http=>//h=>5/

With Not lookbehind

    "http://h:5/".gsub(/(?<!http):/,'=>')
     http://h=>5/

More info on [Lookarounds][]

[Lookarounds]: http://www.regular-expressions.info/lookaround.html
[Oniguruma]: http://oniguruma.rubyforge.org/
