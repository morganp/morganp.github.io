---
layout: post
title: "Licence Types and Short Identifiers"
date: 2014-05-05 20:17:43 +0100
comments: true
sharing: true
footer: true
categories: 
- Tech
tags:
- Ruby
- Gem
- Programming
---

Some time ago [gemspec](http://guides.rubygems.org/specification-reference/) files for ruby gems added the ability to
specify the short identifier for the license type.

    Gem::Specification.new do |s|
      s.licenses    = ['MIT']
    end

The unofficial list of short identifiers is available from [spdx](https://spdx.org/licenses/).
