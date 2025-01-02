---
layout: post
title: "Name Spacing in Matlab"
date: 2013-09-12 19:51:19 +0000
comments: true
categories: Engineering
tags:
- Matlab
- Programming
---

A typical work flow in Matlab involves a folder filled with scripts and functions.
Over time this folder grows until it becomes completely unmaintainable and 
dependencies between scripts can not be tracked.

The next step is to group the related functions into folders in maintainable
collections. They can then be added to the scripts that require them by adding to 
Matlabs search path via:

    addpath('../collection_of_functions_a/');
    addpath('../collection_of_functions_b/');


The main issue I have with this is that of name spacing when working with third
party functions or developing your own it would be easy to override other functions
even internal ones. For toolbox developers it is hard to known all the function names 
from matlabs toolboxes. After a name collision which one is picked up is 
dependent on the path order. Other languages often use name spacing to avoid these
name conflicts.

Since MATLAB Version 7.6 [Packages][] have been available for just this, adding
name spacing to classes, but it also works for raw (plain) functions.

To create a package, as before place functions in a folder, start the folder name
with a `+`, ie `+mypkg` then you have created package mypkg.

To use the package functions in a script they must be [imported][import].

    import mypkg.*

    %% call function_x
    a = mypkg.function_x() ;


As packages themselves can not be on the path you have to [make the parent folder accessible][packages and the path].

If you have a folder containing a lot of packages then this is quite useful.
Add one folder to path then import the required packages.

If the packages are being independently maintained then it is likely that they
all have separate hierarchy (I think this is good from a development point of 
view). To avoid adding unnecessary items to your search path I would recommend a
hierarchy of:


    Top_level_package
      function
      +my_pkg
        function_x.m
        function_y.m
      test
        run_test_function_x.m
        run_test_function_y.m


run_test_function_x.m :

    addpath('../function/');
    import my_pkg.function_x

    %% test function_x
    % ...


The downside of this is that every package needs an `addpath` and `import`.
Which you will have unless all your packages live under one parent directory.

An excerpt from [What is in the Matlab Search Path][search path]:

> The userpath folder is first on the search path, above the folders supplied by
> MathWorks. By default, MATLAB adds the userpath folder to the search path at
> startup. Therefore, the userpath is convenient for storing files where MATLAB
> can access them.


> The userpath consists of a primary path, and on Macintosh and UNIX® platforms,
> it also contains a secondary path. The primary path is only one folder, but the
> secondary path can contain multiple folders.

[Packages]: http://www.mathworks.co.uk/help/matlab/matlab_oop/scoping-classes-with-packages.html
[import]: http://www.mathworks.co.uk/help/matlab/ref/import.html

[search path]: http://www.mathworks.co.uk/help/matlab/matlab_env/what-is-the-matlab-search-path.html


[packages and the path]: http://www.mathworks.co.uk/help/matlab/matlab_env/files-and-folders-that-matlab-accesses.html
