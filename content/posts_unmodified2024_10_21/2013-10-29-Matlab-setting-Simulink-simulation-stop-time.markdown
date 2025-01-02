---
layout: post
title: "Matlab setting Simulink simulation stop time"
date: 2013-10-29 19:17:44 +0000 
comments: true
sharing: true
footer: true
categories: Engineering
tags:
- Matlab
discuss_url: //238
url: //238/Matlab_setting_Simulink_simulation_stop_time
id: 238
---
Running the Simulink model model.mdl from matlab for a specified time: 

    sim('model', stoptime)

Where stoptime is a number. To mix with other options such eg. SimulationMode, things get a little trickier.

    sim( 'model', 'SimulationMode', 'normal')

you would expect:

    sim( 'model', 'SimulationMode', 'normal', 'StopTime', 1)

but this results in :

    Invalid setting in block_diagram 'model' for parameter 'StopTime'

The trick is that parameter, value pairs must be strings, what you actually need to do is:

    sim( 'model', 'SimulationMode', 'normal', 'StopTime', num2str(1) )

Or you can create an ParameterStruct,

    SimOpts.SimulationMode = 'normal';
    SimOpts.StopTime       = num2str(1);
    sim( 'model', SimOpts )

Both of these methods change the way in which the to_workspace blocks work, instead of just outputting a variable to the workspace or available in the calling function sim now returns an 'Simulink.SimulationOutput' object.

Instead of just accessing 'simout' you know need to capture the sim output and use the get command to retrieve the data :

    simdata = sim( 'model', SimOpts ) ;
    simdata.get('simout' )

[Further Info on the sim command](http://www.mathworks.co.uk/help/simulink/ug/using-the-sim-command.html).
