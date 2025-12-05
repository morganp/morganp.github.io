Title: Command Line Disk Usage
Date: 2025-09-06 13:19 
Category: Tech
Tags: MacOS, OSX, CLI  
Author: morganp
Status: published

NCurses Disk Usage
==

A useful Command Line Iterface (CLI) for exploring disk usage:

    ncdu

Example output.

    ncdu 2.9.1 ~ Use the arrow keys to navigate, press ? for help
    --- ... github.io --------------------------
      115.6 MiB [##################] /venv
       59.7 MiB [#########         ] /output
       47.6 MiB [#######           ] /.git
       46.1 MiB [#######           ] /content
        8.0 KiB [                  ]  .DS_Store
        8.0 KiB [                  ]  tasks.py
        8.0 KiB [                  ] /__pycache__
        4.0 KiB [                  ]  Makefile
        4.0 KiB [                  ]  readme.md
        4.0 KiB [                  ]  pelicanconf.py
        4.0 KiB [                  ]  python_search_category.py
        4.0 KiB [                  ]  python_search_and_replace.py
        4.0 KiB [                  ]  create_new_post.py
        4.0 KiB [                  ]  publishconf.py
        4.0 KiB [                  ]  .gitignore
        4.0 KiB [                  ]  CNAME




If you are using MacOS then [brew][brew] can be used to install:

    brew install ncdu

Disk Usage
==

The disk usage tool `du` is a simpler non interactive way of listing file sizes.

    du -h -d 1
      60M	./output
      46M	./content
     8.0K	./__pycache__
     116M	./venv
      48M	./.git
     313M	.

The `-h` gives human readable output, ie sizes in k, M, G TBytes.  
thr `-d 1` on MacOS limits listing to 1 directory deep. `-s`can be used to summarise the requested directory.

Tree
==

Another alternative is to use `tree` to list folde contents with the `-h`option to give human readable file sizes.


    tree -L 1 -h
    [ 608]  .
    ├── [ 128]  __pycache__
    ├── [  19]  CNAME
    ├── [ 224]  content
    ├── [1.2K]  create_new_post.py
    ├── [2.8K]  Makefile
    ├── [ 28K]  output
    ├── [2.1K]  pelicanconf.py
    ├── [ 528]  publishconf.py
    ├── [1.3K]  python_search_and_replace.py
    ├── [1.7K]  python_search_category.py
    ├── [2.2K]  readme.md
    ├── [4.1K]  tasks.py
    ├── [ 224]  venv
    └── [ 224]  venv_old


MacOS install tree with [brew][brew]:

    brew install tree
    


[brew]: https://brew.sh
