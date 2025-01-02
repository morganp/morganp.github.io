---
layout: post
title: "Recent issue with building Gems"
date: 2011-05-07 23:25:34 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Gem
- Programming
- Ruby
discuss_url: //105
url: //105/Recent_issue_with_building_Gems
id: 105
---
When running gem build on a new library I have been working on I started getting the following error:

    [ruby_svg_light.gemspec] isn't a Gem::Specification (Rake::FileTask instead).
    ERROR:  While executing gem ... (NoMethodError)
        undefined method `mark_version' for nil:NilClass

It was from a gemspec similar to that below

    require 'rake/gempackagetask' 
    
    NAME = "ruby_svg_light" 
    Dir.chdir( './lib/')
    require NAME
    Dir.chdir( './../')

    spec = Gem::Specification.new do |s|
      s.name         = NAME
      s.version      = RubySVGLight::VERSION
      s.platform     = Gem::Platform::RUBY
      s.summary      = 'Basic Helper for creating SVG Files'
      s.homepage     = 'http://amaras-tech.co.uk/software/RubySVGLight'
      s.authors      = "Morgan Prior"
      s.email        = NAME + "_gem@amaras-tech.co.uk"
      s.description  = %{A basic library for building SVG files. Not all properties of SVG are supported}
      s.files        = [Dir.glob("LICENSE.rtf")]
      s.files        += Dir.glob("examples/*")
      s.files        += Dir.glob("lib/**/*")
      s.files        += Dir.glob("spec/*") 
    end
    Rake::GemPackageTask.new(spec).define

The Fix was to change to this (Removing Rake::GemPackageTask):

    NAME = "ruby_svg_light"
    Dir.chdir( './lib/')
    require NAME
    Dir.chdir( './../')
    
    Gem::Specification.new do |s|
      s.name         = NAME
      s.version      = RubySVGLight::VERSION
      s.platform     = Gem::Platform::RUBY
      s.summary      = 'Basic Helper for creating SVG Files'
      s.homepage     = 'http://amaras-tech.co.uk/software/RubySVGLight'
      s.authors      = "Morgan Prior"
      s.email        = NAME + "_gem@amaras-tech.co.uk"
      s.description  = %{A basic library for building SVG files. Not all properties of SVG are supported}
      s.files        = [Dir.glob("LICENSE.rtf")]
      s.files        += Dir.glob("examples/*")
      s.files        += Dir.glob("lib/**/*")
      s.files        += Dir.glob("spec/*")
    end


It looks like the new format if for the gemspec is to return a Gem::Specification rather than run the task. I do not know when this change happened.

