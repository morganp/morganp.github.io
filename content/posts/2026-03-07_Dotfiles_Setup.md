Title: Managing Dotfiles with Stow and Git
Date: 2026-03-07
Category: Unix & Tools
Tags: dotfiles, shell, stow, zsh, tmux, vim
Slug: dotfiles-setup-stow-git
Author: morganp
Summary: How to centralise and manage Unix dotfiles in a Git repository, using source directives and GNU Stow to link them into place.

Configuration files (dotfiles) for tools like Zsh, Vim, tmux, and Git tend to accumulate across machines over time. Without a strategy, they diverge: one machine has tuned aliases, another has an old vimrc, and a new machine starts from scratch. Keeping dotfiles in a single Git repository solves this. Clone once, link into place, and every machine stays consistent.

My dotfiles are on GitHub at [morganp/dotfiles](https://github.com/morganp/dotfiles).

## Why Centralise Dotfiles

- A single source of truth for all shell and tool configuration.
- Version history lets you see what changed and roll back if something breaks.
- Setting up a new machine reduces to cloning the repo and running a handful of commands.
- Sharing config across macOS and Linux with minimal platform-specific branching.

## Cloning the Repo

```bash
git clone https://github.com/morganp/dotfiles.git ~/dotfiles
```

## Linking Config Files

There are two approaches depending on the tool.

### Sourcing (Zsh and Vim)

Some tools are simplest to handle by having the home directory config file source the dotfiles version directly.

**Zsh** -- add to `~/.zshrc`:

```bash
source ~/dotfiles/config/shell/dot-zshrc
```

**Vim** -- add to `~/.vimrc`:

```vim
so ~/dotfiles/config/vim/dot-vimrc_clean
```

### GNU Stow (Everything Else)

[GNU Stow](https://www.gnu.org/software/stow/) manages symlinks. It takes a package directory and creates symlinks in a target directory that mirror the structure. With the `--dotfiles` flag, files named `dot-foo` are linked as `.foo` in the target, keeping the repo free of files that would be hidden by default.

Install Stow and other packages via Homebrew:

```bash
brew bundle install --file=~/dotfiles/config/brew
```

Then link the remaining configs:

```bash
cd ~/dotfiles/config
stow git --dotfiles -t ~/
stow input --dotfiles -t ~/
stow screen --dotfiles -t ~/
```

A `run_stow` script in the repo automates this.

## Tmux

Tmux looks for its config via the `$XDG_CONFIG_HOME` variable, set in `config/shell/dot-profile`:

```
$XDG_CONFIG_HOME/tmux/tmux.conf
```

For the tmux plugin manager, clone TPM separately:

```bash
git clone https://github.com/tmux-plugins/tpm ~/.tmux/plugins/tpm
```

## Shell Features

The dotfiles configure the following shell aliases across Bash and Zsh:

| Alias | Description |
|---|---|
| `ls` | File list with colour |
| `ll` | Long list with human-readable sizes and colour |
| `la` | As `ll` but includes hidden files |
| `lt` | Directory tree view |
| `..` | Up one directory |

Other configurations included:

- **Screen:** Virtual tabs across the bottom in standard colours.
- **Inputrc:** Case-insensitive tab completion, including hidden files.
