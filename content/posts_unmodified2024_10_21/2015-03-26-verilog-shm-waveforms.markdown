---
layout: post
title: "Verilog: shm waveforms"
date: 2015-03-26 19:38:29 +0000
comments: true
sharing: true
footer: true
categories: 
- Engineering
tags:
- Programming
- Verilog
---
The best practice is to use a tcl file:

shm.tcl 
 
    database -open waves -shm
    probe -create your_top_level -depth all -all -shm -database waves
    run 
    exit
    
run with :

    irun -access +r testcase.sv -input shm.tcl


Alternatively the following can be added to the simulation:

    initial begin
      $shm_open("waves.shm"); $shm_probe("AS");
    end
    
run with `irun -access +r testcase.sv`

NB: I have had trouble getting this last version to work, the tcl file method is more reliable.

 
