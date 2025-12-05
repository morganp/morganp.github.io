Title: Book: Mastering the command line
Date: 2025-05-31 10:11 
Category: Tech
Tags: python
Author: morganp
Status: published
<!--to publish change draft to published-->

[Mastering the command line like a hacker by Xiaodong Xu][book]

[book]: https://leanpub.com/masteringcli

The book focuses on bash and zsh, which is great since I use both of those shells.

The useful sections from the book include:

Zsh Completion
==
 
    # ~/.zshrc
    autoload -U compinit
    compinit -i

    source ~/dotfiles/zsh-autosuggestions/zsh-autosuggestions.zsh

The zsh-autosuggestions.zsh needs to be [installed/downloaded from Github][zauto], adding as a seperate depo or adding as a submodule to your dotfiles depo.

[zauto]:     https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md


History
==

BASH History
--


    # ~/.bashrc
    # Save 5000 lins of history, with the same scroll back in the terminal
    HISTFILESIZE=5000
    HISTSIZE=5000

    # Do not save duplicate commands, ignore commands starting with a space
    HISTCONTROL='erasedups:ignorespace'

ZSH History
--

    # ~/.zshrc 
    # Save 5000 lins of history, with the same scroll back in the terminal
    SAVEHIST=5000
    HISTSIZE=5000

    # Do not save duplicate commands, ignore commands starting with a space
    setopt HIST_IGNORE_ALL_DUPS
    setopt HIST_IGNORE_SPACE

Using History
--

View the last 5 commands

    # Bash
    $ history 5
    # Zsh
    $ history -5

For zsh we can see the last time the command was run and the time taken with :

    history -i -D

Alternative command to history:

    fc

Searching History
--

The most common way is piping history through grep to search.

    $ history | grep 'cmd'

Ctrl+r is another option which starts a reverse search through the history.

Ctrl+p and Ctrl+n can be used to scroll forwards and backwards through previous commands. Although for me the up down cursors workk mor enaturally.

Repeating Commands
--

Repeat the last command used (Bang Bang)

    !!

great example is when you run a command but it fails because of require Superuser access.

    $ cmd_that_needs_root
    > fail
    $ sudo !!
    > yay!

Execute command 2 back.

    !-2
    #Note
    !! => !-1

Execute command 100 from history

    !100

Last Argument
--

`!$` recalls the last Argument. typicall usage could be with mkdir and cd:

    $ mkdir notes
    $ cd !$

<!--Image Example: image location content/images/photo.jpg-->
![photo]({attach}/images/photo.jpg)
