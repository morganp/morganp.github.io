---
layout: post
title: "rspec testing exceptions"
date: 2012-05-20 15:24:34 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Programming
- Ruby
- Rspec
discuss_url: //166
url: //166/rspec_testing_exceptions
id: 166
---
[rspec][] is a testing framework designed to make test-driven development enjoyable and productive. On the recent release of [RubyIt][] I wanted to improve the error reporting and cover this new functionality with tests.

Do not forget errors should be output to standard error not standard out, ie:

    $stderr.puts 'Error Message'

The rspec documentation has section on [error testing][]. This is my format of my current tests:

    describe Bowling, "#score" do
      it "returns 0 for all gutter game" do
        bowling = Bowling.new
        error1 = %{The error message}
        $stderr.should_receive(:puts).with( error1 ) 
        lambda { bowling.broken_method }.should raise_error(NameError)
      end
    end

The `$stderr.should_receive` as well as setting up a test suppress the stderr outputting so that the output from the command line regression is clean.  

[rspec]: http://rspec.info/

[RubyIt]: http://morganp.github.com/RubyIt/
[error testing]: http://rspec.rubyforge.org/rspec/1.2.9/classes/Spec/Matchers.html#M000176

