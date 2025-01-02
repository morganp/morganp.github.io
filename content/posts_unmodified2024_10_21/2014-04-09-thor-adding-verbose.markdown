---
layout: post
title: "Thor Adding --verbose"
date: 2014-04-09 19:26:44 +0100
comments: true
categories: 
- Tech
tags:
- Programming
- Ruby
- Command Line
comments: true
sharing: true
footer: true
---

With a command line Ruby application using Thor for the option parsing I want to be able to run:

    $ thor_app --version
    > thor_app version 1.0.0

Create a boolean class option, which does not belong to a task, that can be referenced by other tasks. The often used example for a class option is -v verbose, as all tasks can use this to determine how noisy they should be.

Then create a 'version' task and make it the default task, so when no task is defined the version task is ran and can react to the --version flag (class option).

    class CLI < Thor
      #include Thor::Actions
      class_option :version, :type => :boolean

      desc "version", "Show thor_app version"
      def version
        if options[:version]
          puts "thor_app version #{find_version}"
        end
      end
      default_task :version

      no_tasks do
        def find_version
          ## Method can be replaced to look up VERSION
          '1.0.0'
        end
      end
    end

This is based on [my SO Question](http://stackoverflow.com/q/22809972/97073).
