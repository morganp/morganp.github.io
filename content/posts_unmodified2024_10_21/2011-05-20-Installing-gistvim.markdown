---
layout: post
title: "Installing gist.vim"
date: 2011-05-20 20:32:05 +0100 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Git
- Programming
- Ruby
- Vim
- Web
discuss_url: //107
url: //107/Installing_gist.vim
id: 107
---
This vim plugin will allow you to gist directly from vim, simple way is just :Gist to gist entire file more options in the [Full Readme][readme].

If you have not heard of gists or Github. Github is a very popular (especially with in the Ruby community) way of sharing open source code. [Gists][] are the easy way to save and share small snippets of code. 

Install
-------

    cd ~/.vim/plugin
    wget --nocheck-certificate https://github.com/mattn/gist-vim/raw/master/plugin/gist.vim
    cd ../doc
    wget --no-check-certificate https://github.com/mattn/gist-vim/raw/master/doc/gist-vim.txt

    #Now to set Your env variables
    git config --global github.user your-name-here
    git config --global github.token your-token-here

You Github token can be found on the [GitHub Admin][admin] Account Admin tab.

[admin]: https://github.com/account


[Gists]: https://gist.github.com/
[readme]: https://github.com/mattn/gist-vim/blob/master/README.mkd
