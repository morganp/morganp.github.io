---
layout: post
title: "Ideas 1st July to the 3rd July"
date: 2011-07-03 22:38:38 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
discuss_url: //114
url: //114/Ideas_1st_July_to_the_3rd_July
id: 114
---
When working with HDLs (Hardware Description Languages) there a few things that could be improved/made easier:

Renaming a file from an automated tool.

For this I have started work on the Ruby gems 'verilog' and 'verilog_rename'. The verilog gem provides basic functionality to read and save the file from/to disk. The verilog_rename comes with executables but its main function is to provide an easy way to update a file with a new module name and update all references to it, via includes and instantiations.

FSM (Finite State Machines) require good documentation to understand the intention and the code can be quite complicated. A good FSM generator would provide good documentation while embedding any visual code required in to the generated file, so that the generated file could be reloaded and any changes would be reflected in the diagrams. IE the Documentation and code are generated from each other so that they can not become out of date.

A HAML like syntax for verilog might makes template functions much quicker to write and simpler to read.

A full Ruby DSP flow would be nice. Filters could be simulated in ruby. For a given architecture there could be a verilog view which can be generated once from custom parameters. The documentation for these blocks could also come from the Ruby Filter object. Pole Zero diagrams, frequency response, block diagrams, etc. 

A visual browser for verilog code. If web based you could have a source control system that allows hierarchical visual browsing of a system. Possibly generating some parts of the documentation for top level hierarchy etc.

A better fixed_point library for Ruby would be very helpful for verilog code generation, ideally would support outputting in hex, binary and decimal, with good formatting options for commenting word lengths.

A Ruby-Verilog Simulator would be nice for a cheap way to simulate code before entering into regression suites. 



