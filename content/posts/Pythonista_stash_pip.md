Title: Pythonista using stash for pip
Date: 2024-04-19 17:04
Category: Python
Tags: python
Author: morganp
Summary: Installing stash on pythonista

To run pip in pythonista we need to install [stash][1] first.

[1]: https://github.com/ywangd/stash

See stash page sfor latest details, at time of install I had to run this from the pythinista terminal:

    import requests as r; exec(r.get('https://bit.ly/get-stash').content)

![installing stash](img/install_stash.png "Installing Stash")


Then to start stash from a new (restart pyhtonista app) find and run the launch_stash.py script

![start stash](img/launch_stash.png "Starting Stash")

there will then be a second terminal with the stash command line open up

![running stash](img/running_stash.png "Running Stash")
