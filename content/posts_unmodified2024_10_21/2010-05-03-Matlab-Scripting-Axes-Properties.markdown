---
layout: post
title: "Matlab Scripting Axes Properties"
date: 2010-05-03 06:47:06 +0100 
comments: true
sharing: true
footer: true
categories: Engineering
tags:
- Matlab
- plot
discuss_url: //24
url: //24/Matlab_Scripting_Axes_Properties
id: 24
---
Matlab figure properties which can be set through the properties editor can also be set by scripts. My main stumbling block was not realising that gca is a builtin function which returns the current axes. A list of [all properties][mathworks].

Below is a example matlab script which plots a graph then adds minor ticks to the X-axis:

    a =   1:100 ;
    b = 101:200 ;

    figure
    plot(a, b)
    % gca : get current axes
    set(gca, 'XMinorTick','on')

[mathworks]: http://www.mathworks.co.uk/access/helpdesk/help/techdoc/ref/axes_props.html
