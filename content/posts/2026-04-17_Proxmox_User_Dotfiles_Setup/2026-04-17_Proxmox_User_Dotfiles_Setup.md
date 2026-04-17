Title: Proxmox: Setting Up a New User Account with Dotfiles
Date: 2026-04-17
Category: Hardware & Homelab
Tags: Proxmox, Linux, Dotfiles, Git, Stow, Homelab, Productivity
Slug: proxmox-user-dotfiles-setup
Author: morganp
Summary: After creating a non-root Proxmox user, install essential tools (git, stow, gh) and pull in your dotfiles from GitHub to get a familiar shell environment on a fresh host.
Status: published

This post follows on from [Proxmox: Disable root@pam Login and Create a Sudo User]({filename}/posts/2026-04-17_Proxmox_Disable_Root_Login/2026-04-17_Proxmox_Disable_Root_Login.md). At that point you have a working `dave` account with sudo. The next step is making it feel like home: a few essential tools and your dotfiles pulled from GitHub.

The dotfiles repo used in this guide is [morganp/dotfiles](https://github.com/morganp/dotfiles).

## Two Strategies

Before diving in, it helps to understand the two ways config files are deployed. Most tools use **GNU Stow**, which creates symlinks from `$HOME` (or an XDG config dir) into the repo. A change to the repo file is immediately live everywhere that file is symlinked.

A small number of files -- shell configs and Vim -- use a **source wrapper** instead. `~/.zshrc` is a real file that exists only on the local machine and contains a single `source` line pointing into the repo. This allows host-specific additions (work proxy settings, machine-specific aliases) to live below the source line without touching the shared repo file. It also prevents tools that append to `.bashrc` from dirtying the repo.

The split is:

| File | Strategy | Reason |
|---|---|---|
| Most config (git, screen, ctags, ...) | Stow symlink | Identical across all hosts |
| `~/.zshrc`, `~/.bashrc` | Source wrapper | Host-specific additions needed |
| `~/.vimrc` | Source wrapper | Different plugin sets per host |

## Install Basic Tools

SSH in as your new user and install the essentials in one pass:

```bash
sudo apt update && sudo apt install -y git stow
```

`gh` (the GitHub CLI) is not in the standard Debian/Ubuntu repos, so it needs the official GitHub apt source:

```bash
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg \
    | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] \
    https://cli.github.com/packages stable main" \
    | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null

sudo apt update && sudo apt install -y gh
```

Verify all three are present:

```bash
git --version
stow --version
gh --version
```

## Authenticate with GitHub

Before cloning private repos, authenticate `gh`:

```bash
gh auth login
```

Select **GitHub.com**, then **HTTPS**, then **Login with a web browser** (or a personal access token if the host has no browser). The token is stored in `~/.config/gh/hosts.yml`.

Confirm it worked:

```bash
gh auth status
```

## Clone the Dotfiles Repository

```bash
gh repo clone morganp/dotfiles ~/dotfiles
```

Or with plain git over HTTPS if you skipped `gh`:

```bash
git clone https://github.com/morganp/dotfiles.git ~/dotfiles
```

## Strategy 1: Apply with run_stow

The `--dotfiles` flag used throughout the script tells Stow to treat a file named `dot-foo` in the package as `.foo` in the target directory. This lets the repo store dotfiles without leading dots, making them visible in directory listings and avoiding accidental git ignores.

The repo ships a [`run_stow`](https://github.com/morganp/dotfiles/blob/main/config/run_stow) script that applies each package explicitly and creates any XDG config directories that may not exist yet:

```bash
cd ~/dotfiles/config
bash run_stow
```

Under the hood it does things like:

```bash
stow input --dotfiles -t ~/
stow screen --dotfiles -t ~/
stow ctags --dotfiles -t ~/

mkdir -p $HOME/.config/git
stow git -t $HOME/.config/git
```

If Stow finds a file already at the target (e.g. the default `.inputrc` written by the system), it will refuse to proceed and print a conflict warning. Remove or back up the conflicting file first:

```bash
mv ~/.inputrc ~/.inputrc.bak
```

Then re-run the script. Reload the shell once done:

```bash
exec bash
```

## Strategy 2: Shell and Vim via Source Wrapper

The shared repo file holds config common to all hosts. Each machine's `~/.zshrc` is a thin wrapper that sources the shared file first, then adds anything host-specific below:

```bash
# ~/.zshrc -- this file is NOT in the repo, it lives only on this host
source ~/dotfiles/config/shell/dot-zshrc

# host-specific additions below
export http_proxy=http://proxy.work.example.com:3128
alias backup="rsync -av /data /mnt/nas/backup"
```

For a work vs. home split, source a second context file or use a hostname conditional:

```bash
source ~/dotfiles/config/shell/dot-zshrc

if [[ $(hostname) == *"work"* ]]; then
    source ~/dotfiles/config/shell/dot-zshrc_work
fi
```

Create `~/.bashrc` the same way:

```bash
# ~/.bashrc
source ~/dotfiles/config/shell/dot-bashrc
```

For Vim, `dot-vimrc_clean` is a minimal, plugin-free config well suited to servers. Create `~/.vimrc` sourcing it:

```vim
" ~/.vimrc
so ~/dotfiles/config/vim/dot-vimrc_clean
```

The repo also contains `dot-vimrc` (full config with plugins) and `dot-vimrc_spelling` -- point `~/.vimrc` at whichever suits the host. Because these wrapper files are not managed by Stow, they are not tracked by the dotfiles repo on this machine.

## Verify

Check that the Stow symlinks landed:

```bash
ls -la ~/ | grep '\->'
ls -la ~/.config/git/ | grep '\->'
```

Check that the source wrappers are in place:

```bash
head -1 ~/.zshrc
head -1 ~/.vimrc
```

Both should show the `source` / `so` line pointing into `~/dotfiles/`.

Any future change to a file in `~/dotfiles/` is immediately live. Commit and push from `~/dotfiles/` as normal to keep the repo in sync across hosts.

## Summary

| Strategy | Files | How |
|---|---|---|
| Stow symlink | Most config (git, screen, ctags, ...) | `bash run_stow` from `~/dotfiles/config` |
| Source wrapper | `~/.zshrc`, `~/.bashrc`, `~/.vimrc` | Real local file with a single `source` line |

| Tool | Purpose |
|---|---|
| `git` | Version control, cloning the dotfiles repo |
| `stow` | Symlink manager for most config packages |
| `gh` | GitHub CLI for authentication and repo operations |
