Title: tmux Training Manual: Ghostty, xterm and PVE LXC Terminals
Date: 2026-02-27 12:00
Category: Unix \& Tools
Tags: tmux, terminal, ghostty, xterm, proxmox, lxc, linux
Author: morganp
Status: published

tmux is a terminal multiplexer: it lets you run multiple terminal sessions inside a single window, split panes side by side, and crucially, keep sessions alive after you disconnect. For headless Proxmox VE (PVE) LXC containers accessed over SSH, this is essential. If your SSH connection drops mid-task, tmux keeps the job running and lets you reattach exactly where you left off. This manual walks through tmux in practical exercises, covering Ghostty on macOS, xterm, and terminal sessions inside PVE LXC containers.

## Getting Back to a Known State

This section comes first because it is the most important concept to internalise. Just as pressing `Escape` repeatedly in vim returns you to a safe state, tmux has equivalent recovery paths. Learn these before anything else.

### The Prefix Key

Every tmux command starts with the **prefix key**, which is `Ctrl+b` by default. You press `Ctrl+b`, release both keys, then press the command key. Nothing happens if you just hold `Ctrl+b` without following up.

If you press `Ctrl+b` and then the wrong key, tmux usually just ignores it. You are not stuck.

### Exiting Any Mode

| Situation | How to exit |
|---|---|
| Stuck in copy mode | Press `q` or `Escape` |
| Stuck in command mode (`:` prompt) | Press `Escape` or `Ctrl+c` |
| Pane running something | Press `Ctrl+c` to interrupt it |
| Everything looks wrong | Detach with `Ctrl+b d` and reattach fresh |

### Emergency Exit Sequences

**Detach from session (session keeps running):**

```text
Ctrl+b d
```

**List all sessions from outside tmux:**

```bash
tmux ls
```

**Reattach to a named session:**

```bash
tmux attach -t <session-name>
```

**Reattach to the most recent session:**

```bash
tmux attach
```

**Kill a specific pane (with confirmation prompt):**

```text
Ctrl+b x
```

**Kill a specific window (with confirmation prompt):**

```text
Ctrl+b &
```

**Kill a session entirely from the command line:**

```bash
tmux kill-session -t <session-name>
```

**Kill all tmux sessions:**

```bash
tmux kill-server
```

The pattern to remember: `Ctrl+b d` detaches safely, `tmux ls` shows what is running, and `tmux attach -t <name>` gets you back. These three commands will rescue you from almost any situation.

---

## Installation

### Debian and Ubuntu LXC Containers

```bash
sudo apt update
sudo apt install tmux
```

### macOS (Ghostty Host)

```bash
brew install tmux
```

### Verify Installation

```bash
tmux -V
```

Expected output: `tmux 3.x` (version 3.3a or later is common as of 2026).

---

## Terminal Compatibility Notes

### Ghostty

Ghostty works excellently with tmux. It supports true colour, full mouse reporting, and passes modifier keys correctly. No special configuration is needed.

If colours look wrong inside tmux running in Ghostty, set this in your shell profile:

```bash
export TERM=xterm-256color
```

Or add this to `~/.tmux.conf` to force 256 colour mode:

```bash
set -g default-terminal "screen-256color"
```

### xterm

xterm is a reliable fallback. It handles tmux correctly but defaults to a limited colour palette. Set the terminal type explicitly if you see rendering artefacts:

```bash
TERM=xterm-256color tmux
```

Or add to your shell profile permanently:

```bash
export TERM=xterm-256color
```

### PVE LXC Console: noVNC vs SSH

PVE's web console (noVNC) can cause key capture problems with tmux. The `Ctrl+b` prefix may not pass through correctly because the browser intercepts some key combinations. In practice, `Ctrl+b` often works, but scrolling, mouse support, and certain modifier combinations behave inconsistently.

**Recommendation: always use SSH into the LXC for tmux work.**

```bash
ssh user@<lxc-ip>
```

SSH gives you a proper PTY, correct terminal type negotiation, and reliable key forwarding. noVNC is fine for quick root access or emergency recovery, but not for regular tmux sessions.

If you must use the PVE noVNC console with tmux, set a longer escape time to reduce timeout frustration:

```bash
set -sg escape-time 50
```

---

## Exercise 1: First Session

This exercise covers starting, using, detaching, and reattaching to a named session.

### Start a Named Session

```bash
tmux new -s training
```

You are now inside a tmux session called `training`. The green (or coloured) bar at the bottom is the **status bar**.

### Reading the Status Bar

The status bar shows:

- Left side: session name in brackets, e.g. `[training]`, followed by window index and name, e.g. `0:bash`
- Right side: hostname and time (depending on your config)
- An asterisk `*` next to the current window name

### Run a Command

```bash
top
```

Watch it run. Now detach without killing it.

### Detach from the Session

```text
Ctrl+b d
```

You are back at your normal shell prompt. The `top` command is still running inside tmux.

### Verify the Session is Still Running

```bash
tmux ls
```

Output:

```text
training: 1 windows (created Thu Feb 27 12:00:00 2026)
```

### Reattach to the Session

```bash
tmux attach -t training
```

You are back inside the session. `top` is still running. Press `q` to quit `top`.

### Recovery Notes for Exercise 1

If you lose track of session names, `tmux ls` always shows what is running. If `tmux ls` shows nothing, there are no sessions and you start fresh with `tmux new -s <name>`.

---

## Exercise 2: Windows

Windows in tmux are like browser tabs. Each window fills the full terminal area and can run a different program.

### Create a New Window

```text
Ctrl+b c
```

A new window appears. The status bar now shows two windows: `0:bash` and `1:bash`.

### Name the Current Window

```text
Ctrl+b ,
```

A rename prompt appears at the bottom. Type a name, for example `logs`, then press `Enter`.

### Switch Between Windows

Switch to window by number:

```text
Ctrl+b 0
Ctrl+b 1
```

Switch to next window:

```text
Ctrl+b n
```

Switch to previous window:

```text
Ctrl+b p
```

### List All Windows (Known State Check)

```text
Ctrl+b w
```

An interactive list of all windows appears. Use arrow keys to navigate and `Enter` to select. Press `Escape` to cancel without switching. This gives you a clear view of what is open.

### Close a Window

The cleanest way is to exit the shell:

```bash
exit
```

Or force close the current window (with confirmation):

```text
Ctrl+b &
```

Type `y` to confirm. If you have multiple windows, tmux moves you to the next one. If it was the last window, the session ends.

### Recovery Notes for Exercise 2

If you are confused about which window you are in, `Ctrl+b w` shows the full list. If a window is running something stuck, `Ctrl+b &` closes it after confirmation.

---

## Exercise 3: Panes

Panes split a single window into multiple terminal areas visible at the same time.

### Split Horizontally (Left and Right)

```text
Ctrl+b %
```

The window is now split into two vertical columns (left pane and right pane).

### Split Vertically (Top and Bottom)

```text
Ctrl+b "
```

The current pane is split into two horizontal rows.

### Navigate Between Panes

Use the prefix followed by an arrow key:

```text
Ctrl+b <arrow key>
```

For example, `Ctrl+b` then the right arrow moves focus to the right pane.

### Show Pane Numbers (Known State Check)

```text
Ctrl+b q
```

Large numbers appear briefly over each pane. Press the number while it is visible to jump to that pane directly.

### Resize a Pane

Hold the prefix and then repeatedly press arrow keys. In most terminals:

```text
Ctrl+b :resize-pane -D 5
```

This resizes the current pane down by 5 rows. Directions: `-U` (up), `-D` (down), `-L` (left), `-R` (right).

Alternatively, if mouse mode is enabled (covered in the config section), you can drag pane borders.

### Zoom a Pane to Full Screen

```text
Ctrl+b z
```

The current pane expands to fill the entire window. Press `Ctrl+b z` again to return to the split layout. The status bar shows `[Z]` when a pane is zoomed.

### Close a Pane

The cleanest way:

```bash
exit
```

Or force close with confirmation:

```text
Ctrl+b x
```

Type `y` to confirm. If it is the last pane in the window, the window closes too.

### Recovery Notes for Exercise 3

`Ctrl+b q` shows pane numbers so you can see where you are. `Ctrl+b z` is useful if you accidentally zoomed and the layout looks wrong: toggle it again to return to the split view.

---

## Exercise 4: Copy Mode (and How to Exit It)

Copy mode lets you scroll back through terminal output and copy text. Knowing how to exit it reliably is as important as knowing how to enter it.

### Enter Copy Mode

```text
Ctrl+b [
```

The status bar shows `[Copy]` in the top right corner. You are now in copy mode.

### Navigate in Copy Mode

| Key | Action |
|---|---|
| Arrow keys | Move cursor one line/column |
| `PgUp` / `PgDn` | Scroll up or down a page |
| `g` | Go to the top of the scrollback buffer |
| `G` | Go to the bottom (current output) |
| `/` | Search forward |
| `?` | Search backward |
| `n` | Next search match |
| `N` | Previous search match |

### Exit Copy Mode

**Press `q` or `Escape`.**

This is the key thing to remember. If you are in copy mode and the terminal seems unresponsive to normal commands, you are still in copy mode. Press `q` or `Escape` to return to normal mode.

### Copy Text

1. Enter copy mode: `Ctrl+b [`
2. Navigate to the start of the text you want
3. Press `Space` to begin selection
4. Move to the end of the text
5. Press `Enter` to copy and exit copy mode

### Paste Copied Text

```text
Ctrl+b ]
```

This pastes the tmux clipboard into the current pane at the cursor position.

### Recovery Notes for Exercise 4

If your keyboard input is being swallowed and commands are not running, the most likely cause is that you are in copy mode. Press `q` first, then `Escape` if `q` did not work.

---

## Exercise 5: PVE LXC Workflow

This exercise demonstrates the core use case for tmux in a Proxmox VE environment: running long tasks in an LXC container and safely reconnecting after a disconnect.

### Step 1: SSH into the LXC Container

From your workstation (Ghostty or any terminal):

```bash
ssh user@<lxc-ip>
```

Replace `<lxc-ip>` with the IP address of your LXC container. You can find this in the PVE web interface under the container's Network tab, or by running `ip a` inside the container.

### Step 2: Start a Persistent Session

```bash
tmux new -s work
```

### Step 3: Run a Long Job

```bash
sudo apt upgrade
```

This may take several minutes. Let it run.

### Step 4: Detach and Close SSH

```text
Ctrl+b d
```

You are back at the container's shell prompt (outside tmux). Now close the SSH connection entirely:

```bash
exit
```

Or close the terminal window. The `apt upgrade` is still running inside the tmux session on the LXC container.

### Step 5: Reconnect and Reattach

Open a new terminal and SSH back in:

```bash
ssh user@<lxc-ip>
```

List running sessions:

```bash
tmux ls
```

Output:

```text
work: 1 windows (created Thu Feb 27 12:05:00 2026)
```

Reattach:

```bash
tmux attach -t work
```

You are back watching `apt upgrade` complete, exactly as you left it.

### Why tmux Beats GNU Screen for LXC Work

Both tmux and screen provide session persistence, but tmux has clearer defaults, better pane support, and easier scripting. The `tmux ls` command gives a clean session overview. Pane splitting is built in without workarounds. Configuration via `~/.tmux.conf` is straightforward. For new setups, start with tmux.

---

## Quick Reference Table

| Action | Key or Command | Notes |
|---|---|---|
| New named session | `tmux new -s <name>` | Run from shell |
| List sessions | `tmux ls` | Run from shell |
| Attach to session | `tmux attach -t <name>` | Run from shell |
| Detach from session | `Ctrl+b d` | Session keeps running |
| New window | `Ctrl+b c` | |
| Rename window | `Ctrl+b ,` | |
| Switch to window N | `Ctrl+b <N>` | 0-9 |
| Next window | `Ctrl+b n` | |
| Previous window | `Ctrl+b p` | |
| List windows | `Ctrl+b w` | Interactive picker |
| Close window | `Ctrl+b &` | Confirmation required |
| Split pane left/right | `Ctrl+b %` | |
| Split pane top/bottom | `Ctrl+b "` | |
| Navigate panes | `Ctrl+b <arrow>` | |
| Show pane numbers | `Ctrl+b q` | |
| Zoom pane toggle | `Ctrl+b z` | Status bar shows [Z] |
| Close pane | `Ctrl+b x` | Confirmation required |
| Enter copy mode | `Ctrl+b [` | |
| Exit copy mode | `q` or `Escape` | |
| Start selection | `Space` | While in copy mode |
| Copy selection | `Enter` | While in copy mode |
| Paste | `Ctrl+b ]` | |
| Reload config | `Ctrl+b :source-file ~/.tmux.conf` | |
| Kill session | `tmux kill-session -t <name>` | Run from shell |

---

## Config Tweaks

tmux reads `~/.tmux.conf` on startup. Create or edit this file to customise behaviour. Changes take effect in new sessions, or you can reload without restarting.

### Location

```bash
~/.tmux.conf
```

### Change the Prefix Key to Ctrl+a

Many users prefer `Ctrl+a` because it is easier to reach and was the `screen` default:

```bash
unbind C-b
set -g prefix C-a
bind C-a send-prefix
```

After this, all commands use `Ctrl+a` instead of `Ctrl+b`. The `bind C-a send-prefix` line lets you type a literal `Ctrl+a` in programs like bash by pressing the prefix twice.

### Enable Mouse Support

```bash
set -g mouse on
```

With mouse enabled, you can click to select panes, drag borders to resize, and scroll with the mouse wheel. Scroll wheel enters copy mode automatically. To exit copy mode after scrolling, press `q`.

### Increase Scrollback Buffer

The default scrollback is 2000 lines, which fills up quickly. Increase it:

```bash
set -g history-limit 10000
```

### Reduce Escape Time (Useful for PVE noVNC)

```bash
set -sg escape-time 50
```

This reduces the delay tmux waits after pressing `Escape` before deciding it is not a prefix sequence. Lower values make `Escape` feel more responsive in vim and other tools inside tmux.

### Start Window and Pane Index at 1

By default windows are numbered from 0. Starting at 1 maps better to the number keys:

```bash
set -g base-index 1
setw -g pane-base-index 1
```

### Reload Config Without Restarting

After editing `~/.tmux.conf`, reload it inside a running tmux session:

```text
Ctrl+b :source-file ~/.tmux.conf
```

Or add a keybinding for this in `~/.tmux.conf`:

```bash
bind r source-file ~/.tmux.conf \; display-message "Config reloaded"
```

Then use `Ctrl+b r` (or `Ctrl+a r` if you changed the prefix) to reload.

### Minimal Recommended Config

```bash
# Change prefix to Ctrl+a
unbind C-b
set -g prefix C-a
bind C-a send-prefix

# Enable mouse
set -g mouse on

# Increase scrollback
set -g history-limit 10000

# Reduce escape time
set -sg escape-time 50

# Start numbering from 1
set -g base-index 1
setw -g pane-base-index 1

# Reload config
bind r source-file ~/.tmux.conf \; display-message "Config reloaded"
```

---

## Known State Cheatsheet

Bookmark this section. When something goes wrong, work through it from top to bottom.

**1. Exit any mode:**

- In copy mode: press `q`, then `Escape` if needed
- In command mode: press `Escape`
- Program stuck: press `Ctrl+c`

**2. Check what windows and panes are open:**

```text
Ctrl+b w    (list windows)
Ctrl+b q    (show pane numbers)
```

**3. Detach safely (session keeps running):**

```text
Ctrl+b d
```

**4. From the shell, list all sessions:**

```bash
tmux ls
```

**5. Reattach to a session:**

```bash
tmux attach -t <name>
tmux attach          # most recent session
```

**6. Kill a stuck pane:**

```text
Ctrl+b x    (confirmation prompt, then y)
```

**7. Kill a stuck window:**

```text
Ctrl+b &    (confirmation prompt, then y)
```

**8. Kill a session entirely:**

```bash
tmux kill-session -t <name>
```

**9. Nuclear option: kill all tmux sessions:**

```bash
tmux kill-server
```

**10. Start fresh:**

```bash
tmux new -s main
```

Following this list top to bottom will resolve the vast majority of situations where tmux feels stuck or confusing. The core principle: `Ctrl+b d` gets you out, `tmux ls` shows what is there, and `tmux attach` gets you back in.
