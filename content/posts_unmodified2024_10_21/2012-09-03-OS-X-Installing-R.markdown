---
layout: post
title: "OS X Installing R"
date: 2012-09-03 20:11:46 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Apple
- Command Line
- OS X
- Programming
- R
- Mountain Lion
discuss_url: //190
url: //190/OS_X_Installing_R
id: 190
---
[R][] is a language for statistical computing and graphics. It is the choice of [Coursera][] Statistics One.

It can be installed on OS X via the [pkg][] available on the main website which is my recommendation or via [Homebrew][]. 

*I have been unable to get the homebrew version to install correctly.*  
*On Mountain Lion the homebrew install also requires a few additional packages.*

Install R with Homebrew
--

**Update** First run `brew tap homebrew/science` to make the R package available **/Update**

If you run `brew install r` when you do not have a fortran compiler you will see the following error:

>This formula requires a fortran compiler, but we could not find one by
>looking at the FC environment variable or searching your PATH for `gfortran`.
>Please take one of the following actions:
>
>  - Decide to use the build of gfortran 4.2.x provided by Homebrew using
>        `brew install gfortran`
>
>  - Choose another Fortran compiler by setting the FC environment variable:
>        export FC=/path/to/some/fortran/compiler
>    Using an alternative compiler may produce more efficient code, but we will
>    not be able to provide support for build errors.

To save time just run :

    brew update
    brew install gfortran r

Although I ran into some issues with linking libtiff and jpeg and had to run:

    brew link -f  libtiff jpeg
    brew install r

I still got checksum fails. Might have to wait for a brew update.

If you are running Mountain Lion then you will also run into this:

>Unsatisfied dependency: XQuartz 
>Please install the latest version of XQuartz:
>  https://xquartz.macosforge.org
>Error: An unsatisfied requirement failed this build.

The easiest way to install R on OS X really does seem to be just run the [package][pkg]. 134MB install size.

[R]: http://www.r-project.org/
[Coursera]: http://coursera.org
[pkg]: http://cran.r-project.org/bin/macosx/
[Homebrew]: http://mxcl.github.com/homebrew/
