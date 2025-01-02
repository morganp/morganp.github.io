---
layout: post
title: "Ruby Block Selection in Vim (Plugin)"
date: 2010-12-28 22:42:03 +0000 
comments: true
sharing: true
footer: true
categories: Tech
tags:
- Automation
- Programming
- Ruby
- Vim
discuss_url: //84
url: //84/Ruby_Block_Selection_in_Vim_%28Plugin%29
id: 84
---
A new very cool plugin for Rubyists using Vim. [RubyBlock][rubyblock] TextObjects created by [Drew Neil][drewneil] from [Vimcasts.org][vimcast]. Once installed it will add the commands var, vir, sr & ir for selecting Ruby blocks, Drew Neil has explained it well on [VimCasts][rubyblock].
This vim plugin relies on two others [matchit.vim][vim39] and [textobj-user][vim2100]. I believe that [matchit.vim][vim39] is built in to current builds of vim and only requires enabling by adding the following to you .vimrc file: 

    runtime macros/matchit.vim    

If it is not built in to your build or you want the latest you can get a zip file from the [vim scripts][vim39] Uncompress it and put matchit.vim into your vim/plugin folder and matchit.txt in to your vim/doc. these are typically ~/.vim/plugin ~/.vim/doc but can be any where on thr $VIMRUNTIME, I redefine mine ot a github repo via (in .vimrc):

    set runtimepath=$HOME/.unix_config/vim,$VIMRUNTIME


To add the new help files to vim help you run (using the path to you vim help files):

    :helptags ~/.vim/doc

Next, [textobj-user][vim2100] plugin which is a generic wrapper for text objects and provides no added vim functionality by itself. Installation of this plugin confused me as the zip file and github all had make files and I do not like having to compile my plugins. However after uncompressing the zip file I moved the contents of the autoload folder to vim/autoload and contents of the docs folder to vim/docs, the RubyBlock plugin seems to work so I assume that this is all that is required.

Drew Neil has distributed his plugin as a vimball (*.vba) which is the simplest to install way of distributing vim plugins. Download file from [vim scripts][vim3382]. Open the file with vim and  then :source %

    $ vim ~/Downloads/textobj-rubyblock.vba
    :source %

Now open a ruby file move to a line inside a block and start trying out your new commands: var, vir, ar & ir.

Thanks to [Drew Neil][drewneil] of [Vimcasts.org][vimcast] for creating this plugin.


[drewneil]: http://drewneil.com/
[rubyblock]: http://vimcasts.org/blog/2010/12/a-text-object-for-ruby-blocks/
[vimcast]: http://vimcasts.org/

[vim3382]: http://www.vim.org/scripts/script.php?script_id=3382
[vim2100]: http://www.vim.org/scripts/script.php?script_id=2100
[vim39]: http://www.vim.org/scripts/script.php?script_id=39

