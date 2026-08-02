Title: An always-on tmux setup
Date: 2026-08-02
Category: Unix & Tools
Tags: tmux, shell, dotfiles, zsh, bash, terminal
Author: morganp
Status: published
Summary: Four changes that make tmux disappear into the background: shell-native autostart from bashrc and zprofile, session persistence with resurrect and continuum, extended key reporting so Shift+Enter survives the tmux layer, and a two-row status line with a keybinding hint row.
Slug: tmux-always-on-setup

[![An always-on tmux setup]({attach}/images/Unix/tmux/tmux-hero-900w.png)]({attach}/images/Unix/tmux/tmux-hero-HQ.png)

If you have not met it yet, tmux is a terminal multiplexer. It lets one
terminal window hold many sessions, split into panes, and it keeps those
sessions alive after you disconnect. I wrote up the day-to-day mechanics
previously in the
[tmux Training Manual]({filename}2026-02-27_tmux_Training_Manual.md), which is
the better starting point if you are learning the keybindings.

This post is about what came after that. Once tmux is part of your daily
routine, a handful of small annoyances start to grate. You forget to start it
and lose a terminal full of work. A reboot wipes out a carefully arranged set
of windows and panes. Shift+Enter mysteriously stops working in Claude Code
and Codex the moment you are inside tmux. And you spend the first month
looking up the same four keybindings over and over.

Each of those has a fix, and each fix is only a few lines of config. This post
walks through all four as they now sit in my
[dotfiles repository](https://github.com/morganp/dotfiles). Individually they
are small. Together they turn tmux from something you remember to start into
something that is simply always there.

The four changes are:

| Change | Problem it solves |
|---|---|
| Shell-native autostart | Forgetting to run `tmux`, then losing work when the terminal closes |
| tmux-resurrect and tmux-continuum | Losing the window and pane layout across a restart |
| Extended key reporting | Shift+Enter being byte-identical to Enter inside tmux |
| Two-row status line | Not remembering keybindings, and losing the host label under a TUI |

Everything below lives in the tmux config and the shell profile. On a standard
Linux or macOS setup those are `~/.tmux.conf` (or `~/.config/tmux/tmux.conf`)
and `~/.bashrc` or `~/.zshrc`. If you are following along without my dotfiles,
use the paths in the left column below and ignore the rest of this section.

| Standard location | Tracked file in my dotfiles |
|---|---|
| `~/.tmux.conf` or `~/.config/tmux/tmux.conf` | [`config/tmux/tmux.conf`](https://github.com/morganp/dotfiles/blob/main/config/tmux/tmux.conf) |
| `~/.zprofile` | [`config/shell/dot-zprofile`](https://github.com/morganp/dotfiles/blob/main/config/shell/dot-zprofile) |
| `~/.bashrc` | [`config/shell/dot-bashrc`](https://github.com/morganp/dotfiles/blob/main/config/shell/dot-bashrc) |

Two different mechanisms put those in place, and neither is a symlink. tmux
respects `XDG_CONFIG_HOME`, and `config/shell/dot-profile` sets it to point
straight at the repository:

```sh
export XDG_CONFIG_HOME=$HOME/dotfiles/config
```

So tmux reads `~/dotfiles/config/tmux/tmux.conf` directly, with no linking step
at all. The shell files are sourced rather than linked, which keeps
machine-local settings out of the repository. `~/.zprofile` on each machine
starts with:

```sh
source "$HOME/dotfiles/config/shell/dot-zprofile"
```

The `dot-` prefix is a GNU Stow convention, used elsewhere in the repository
for configs that genuinely are linked. The wider layout is covered in
[Managing Dotfiles with Stow and Git]({filename}2026-03-07_Dotfiles_Setup.md).

## Autostart from the shell profile

The usual advice is to configure autostart in the terminal emulator. That ties
the behaviour to one application, so it does not follow you over SSH, and it
does not survive changing terminals. Doing it in the shell profile is portable
across every terminal on every machine that gets the dotfiles.

This goes in `~/.zprofile`, which in my case is
[`config/shell/dot-zprofile`](https://github.com/morganp/dotfiles/blob/main/config/shell/dot-zprofile):

```zsh
# Start or attach to the shared tmux session for interactive terminals. TMUX is
# set inside tmux, which prevents new panes from creating nested sessions.
if [[ -o interactive && -z "${TMUX:-}" && -t 1 ]] && (( $+commands[tmux] )); then
  exec tmux new-session -A -s main
fi
```

The Bash equivalent goes in `~/.bashrc`, mine at
[`config/shell/dot-bashrc`](https://github.com/morganp/dotfiles/blob/main/config/shell/dot-bashrc).
Same logic, portable syntax:

```bash
if [[ $- == *i* && -z "${TMUX:-}" && -t 1 ]] && command -v tmux >/dev/null 2>&1; then
  exec tmux new-session -A -s main
fi
```

Four guards matter here, and every one of them prevents a real failure mode.

**`-z "${TMUX:-}"`** is the important one. tmux sets `TMUX` inside every pane
it owns. Without this test, each new pane runs the profile, which starts
another tmux, which runs the profile again. That is an infinite nesting loop
that locks up the terminal.

**`-t 1`** checks that standard output is a terminal. Non-interactive uses that
still source the profile, such as `ssh host command` or an editor spawning a
login shell to read the environment, must not be hijacked into tmux.

**`command -v tmux`** keeps the profile portable to machines where tmux is not
installed. A missing binary should not break shell startup.

**`exec`** replaces the shell process rather than nesting one inside the other.
Without it you get a parent shell doing nothing but waiting, and detaching from
tmux drops you into that dead shell instead of closing the window.

`new-session -A -s main` is the whole trick: attach to the session named `main`
if it exists, create it if it does not. One flag, no `has-session` test and
conditional branch.

The Zsh version goes in `~/.zprofile`, not `~/.zshrc`. `zprofile` is sourced
once for a login shell. `zshrc` is sourced for every interactive shell, which
would be more places than necessary to run an `exec`.

## Session persistence with resurrect and continuum

[tmux-resurrect](https://github.com/tmux-plugins/tmux-resurrect) saves and
restores the tmux environment. [tmux-continuum](https://github.com/tmux-plugins/tmux-continuum)
drives resurrect automatically on a timer and restores on server start. They
are designed to be used together.

```tmux
# Session persistence across restarts.
# resurrect: prefix + Ctrl-s saves, prefix + Ctrl-r restores. Saves the window
# and pane layout, window names, and each pane's working directory.
# continuum: autosaves every 15 min and auto-restores when the server starts.
set -g @resurrect-capture-pane-contents 'on'
set -g @resurrect-dir "$HOME/.tmux/resurrect"
set -g @continuum-restore 'on'
set -g @continuum-save-interval '15'
```

What actually gets restored: the window and pane layout, window names, the
active window and pane, and each pane's working directory.
`@resurrect-capture-pane-contents 'on'` adds the visible scrollback of each
pane, so a restored session looks like the one you left rather than a grid of
empty prompts.

Running programs are not restored by default, and that is the right default.
Resurrect has an opt-in process whitelist, but blindly re-launching whatever
was running is a good way to have a reboot re-run something you did not want
re-run.

Saved state lands in `~/.tmux/resurrect` as timestamped text files, with a
`last` symlink to the most recent:

```
tmux_resurrect_20260802T094413.txt
tmux_resurrect_20260802T103006.txt
pane_contents.tar.gz
last -> tmux_resurrect_20260802T103006.txt
```

They are plain text. If a restore goes wrong you can read the file and see
exactly what it thought your layout was.

The manual keys still work alongside the autosave: `prefix + Ctrl-s` saves,
`prefix + Ctrl-r` restores. Worth using the manual save before a deliberate
reboot rather than waiting up to 15 minutes for the timer.

### The ordering gotcha

This one cost real debugging time:

```tmux
# Keep these at the very bottom. continuum appends itself to status-right, so
# it must run after the status-right set above or autosave is silently lost.
run-shell ~/.tmux/plugins/tmux-resurrect/resurrect.tmux
run-shell ~/.tmux/plugins/tmux-continuum/continuum.tmux
```

Continuum implements its timer by appending a hook to `status-right`. tmux
evaluates the status line on an interval, so continuum piggybacks on that as
its clock. If your own `set -g status-right` runs *after* continuum loads, it
overwrites continuum's addition and the autosave stops.

Nothing warns you. Manual saves keep working, so the setup looks healthy right
up until a crash and the newest saved state is hours old. Keep the `run-shell`
lines at the very bottom of the file, after every `status-right` assignment.

These are loaded with direct `run-shell` calls rather than through the tmux
plugin manager, so the plugins need cloning by hand:

```bash
git clone https://github.com/tmux-plugins/tmux-resurrect ~/.tmux/plugins/tmux-resurrect
git clone https://github.com/tmux-plugins/tmux-continuum ~/.tmux/plugins/tmux-continuum
```

## Letting Shift+Enter through

In a plain terminal, Enter and Shift+Enter send the same byte: carriage return,
`0x0d`. The Shift modifier has nowhere to go in the traditional encoding. This
is not a tmux problem to begin with, but tmux makes it one, because tmux must
choose whether to pass the modern encoding through.

The modern encoding is CSI u, sometimes called the Kitty keyboard protocol or
extended key reporting. It gives modifiers a place to live in the escape
sequence, so `Shift+Enter` becomes distinguishable from `Enter`.

This matters because terminal AI tools bind Shift+Enter to "insert a newline
without submitting". Claude Code and Codex both do. Inside tmux without the
setting below, that binding is dead: every Shift+Enter submits the prompt
mid-thought.

```tmux
# Pass extended key reporting (CSI u) through to applications. Without this,
# Shift+Enter is byte-identical to Enter inside tmux, so TUIs like Codex and
# Claude Code cannot bind it to "insert newline".
set -s extended-keys on
set -as terminal-features 'xterm*:extkeys'
```

Two lines, two different jobs:

`set -s extended-keys on` is a server option that tells tmux to forward
extended keys to the application when the application asks for them. The
alternative value `always` sends them unconditionally, which is more aggressive
and can confuse applications that never opted in. `on` is the safer setting.

`set -as terminal-features 'xterm*:extkeys'` tells tmux that the *outer*
terminal is capable of the protocol. Without this, tmux has no reason to
believe the sequences will survive on the way out, so it will not emit them.
Note the `-a` flag: it appends to the existing feature list rather than
replacing it.

Both halves are required. The chain is terminal, then tmux, then application,
and any link that does not speak the protocol breaks it. Your outer terminal
also needs to support extended keys. Ghostty, Kitty, WezTerm and recent iTerm2
do. Extended keys need tmux 3.2 or newer.

## The status line and a hint row

The last piece is the status line. Two things were wrong with the default. The
host label from the Starship prompt disappears the moment a full-screen TUI
takes over the pane, so on a multi-machine SSH setup you lose track of where
you are. And tmux keybindings are hard to remember while you are still learning
them.

```tmux
set -g status 2
set -g status-style 'bg=#1e1e2e,fg=#a6adc8'
set -g status-left-length 30
set -g status-left '#[fg=#89b4fa,bold] #S #[default]'
set -g status-right-length 80
set -g status-right '#[fg=#89b4fa,bold]󰂋 #{?#{E:DOTFILES_HOST},#{E:DOTFILES_HOST},#h}#[fg=#6c7086]  •  #[fg=#f9e2af]%H:%M '
set -g window-status-separator ''
set -g window-status-format '#[fg=#6c7086] #I:#W '
set -g window-status-current-format '#[fg=#cba6f7,bold] #I:#W '
set -g 'status-format[1]' '#[align=centre,fg=#7f849c]Prefix: Ctrl-b  •  c: new tab  •  ,: rename tab  •  n/p: next/previous tab  •  0–9: choose tab  •  d: detach'
```

`set -g status 2` is the interesting one. Most people know `status on` and
`status off`, but the option also takes a row count up to 5. With two rows,
`status-format[0]` is the normal status line and `status-format[1]` is a second
row you can fill with anything. Here it holds a centred cheat sheet of the
keybindings you need while learning tmux. It is a comment in the config that
you actually read, and deleting it later is a one-line change.

The host label uses a conditional format:

```
#{?#{E:DOTFILES_HOST},#{E:DOTFILES_HOST},#h}
```

`#{?condition,true,false}` is the tmux ternary. `#{E:VAR}` expands an
environment variable from the session environment. So this reads: if
`DOTFILES_HOST` is set, show it, otherwise fall back to `#h`, tmux's own short
hostname. The fallback means the config still works on a machine that has tmux
but not the rest of the dotfiles.

### Where DOTFILES_HOST comes from

The variable is set in the shell, not in tmux, which is the point: one
definition feeds both the Starship prompt and the tmux status line, so they can
never disagree about which machine you are on.

In
[`config/shell/dot-zprompt`](https://github.com/morganp/dotfiles/blob/main/config/shell/dot-zprompt):

```zsh
_dotfiles_set_host_label() {
  local fqdn="" host="" rest="" label=""

  fqdn="$(hostname -f 2>/dev/null || hostname 2>/dev/null || printf '%s' "${HOST:-}")"
  host="${fqdn%%.*}"
  label="$host"

  if [[ "$host" == login* && "$fqdn" == *.*.* ]]; then
    rest="${fqdn#*.}"
    label="${rest%%.*}"
  fi

  typeset -g DOTFILES_HOST="$label"
}
_dotfiles_set_host_label
unset -f _dotfiles_set_host_label
export DOTFILES_HOST
```

The Bash version in `dot-bashrc` is the same logic with `export` in place of
`typeset -g`.

Normally this is just the short hostname: take the fully qualified name and cut
everything from the first dot. The interesting part is the `login*` branch.
Compute clusters tend to name their entry points `login1`, `login2`, `login3`,
which tells you nothing about which cluster you have landed on. When the short
name starts with `login` and the FQDN has at least two dots, the label becomes
the next domain component instead. So `login2.helios.example.com` displays as
`helios`, which is the piece of information you actually wanted.

The function runs once per shell and is then unset, so it costs nothing on
redraw. `export` is what matters for tmux: only exported variables reach the
tmux session environment where `#{E:DOTFILES_HOST}` can read them.

Starship picks up the same variable through its `env_var` module in
`config/starship/starship.toml`:

```toml
[env_var.DOTFILES_HOST]
# Shared with tmux; cluster login hosts are normalized by dot-zprompt.
variable = "DOTFILES_HOST"
format = "[󰂋 ]($style)[$env_value]($style) "
style = "#89b4fa bold"
```

The same Nerd Font glyph and the same blue appear in the tmux `status-right`
above, so the label looks identical whether it is being drawn by the prompt or
by tmux. When a TUI takes over the pane and the prompt scrolls away, the status
line keeps showing it.

### Keeping the label fresh

Session environment variables are captured when the session is created, so a
long-lived session can hold a stale value. This line fixes that:

```tmux
# Refresh the label when attaching from a new client. The explicit array index
# makes repeated config reloads idempotent.
set -g 'update-environment[99]' DOTFILES_HOST
```

`update-environment` is a list of variables tmux refreshes from the attaching
client. Setting an explicit index rather than using `-a` to append means
reloading the config repeatedly overwrites slot 99 each time instead of piling
up duplicate entries.

The rest is cosmetic and matches the Catppuccin Mocha palette used elsewhere in
the setup:

```tmux
set -g pane-border-style 'fg=#313244'
set -g pane-active-border-style 'fg=#89b4fa'
set -g message-style 'bg=#313244,fg=#cdd6f4'
set -g mode-style 'bg=#cba6f7,fg=#1e1e2e,bold'
```

Two more settings worth calling out, both near the top of the file:

```tmux
# Enable mouse mode so trackpad scroll enters copy mode and scrolls pane
# history, instead of being translated to arrow keys that TUIs like Claude
# Code read as prompt history navigation
set -g mouse on

# vim keys for copy mode
setw -g mode-keys vi
```

`mouse on` is not only about clicking to select panes. Without it, trackpad
scroll is translated into arrow keys, and a TUI reading arrow keys as prompt
history navigation will scroll your prompt history instead of the pane
scrollback. That is a confusing bug until you know the cause.

## Gotchas worth repeating

The four things most likely to bite:

1. **Nested sessions.** The `TMUX` guard in the shell profile is not optional.
   Without it, opening a pane starts a new tmux inside the pane, forever.
2. **Continuum's ordering.** `run-shell` for continuum must come after every
   `status-right` assignment, or the autosave silently stops while manual saves
   keep working.
3. **Extended keys need both lines.** `extended-keys on` alone does nothing if
   tmux does not also believe the outer terminal supports the protocol.
4. **`exec`, not a bare call.** Without `exec`, detaching leaves you in a dead
   parent shell rather than closing the window.

Reload after editing with `prefix + r`, which is bound in the config:

```tmux
bind r source-file $XDG_CONFIG_HOME/tmux/tmux.conf
```

Note that reloading does not undo settings, it only applies new ones. When
debugging status line problems, kill the tmux server with `tmux kill-server`
and start fresh rather than trusting a reload.

Tested on tmux 3.7b. The full configuration is
[`config/tmux/tmux.conf`](https://github.com/morganp/dotfiles/blob/main/config/tmux/tmux.conf)
in the [dotfiles repository](https://github.com/morganp/dotfiles).
