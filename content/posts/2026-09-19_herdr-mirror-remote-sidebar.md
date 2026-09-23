Title: Mirroring a remote herdr server
Date: 2026-09-19
Category: Unix & Tools
Tags: herdr, ssh, systemd, homelab, terminal, dotfiles
Author: morganp
Status: draft
Summary: The herdr-mirror plugin turns workspaces on a remote herdr server into real local workspaces with live panes, so one window shows every agent on every machine. This post separates the local requirements from the remote ones, sets up key-based access and a systemd user unit, and explains how the connection starts.
Slug: herdr-mirror-remote-sidebar

The agent on the homelab box finished eleven minutes ago. Nothing told you,
because its terminal lives behind an ssh session in a window you are not
looking at. Meanwhile the sidebar in front of you shows four local agents and
reports their state perfectly.

[![A terminal workspace window: the sidebar lists a local space and a purple remote space, and an amber line carries the remote session from that entry into the main pane]({static}/images/Unix/HerdrMirror/01-hero-900w.png)]({static}/images/Unix/HerdrMirror/01-hero-HQ.png)

This post is for anyone who runs coding agents on more than one machine and
wants a single window that shows all of them. It covers the `herdr-mirror`
plugin: what each end of the link needs, how to set up the access it depends
on, and how the connection starts. This setup uses a laptop as the local
machine and a homelab server called `homelab` as the remote.

The plugin makes each remote workspace a real local workspace named
`<host>: <name>`. Its panes stream the remote terminal live, and its agents
report their true state in the sidebar. Mirroring is one way, but you can type
into any mirror pane to drive the remote session.

## What you need on each machine

The requirements are lopsided. Almost everything happens on the local
machine, and the remote runs stock herdr and nothing else.

### Requirements on the local machine

The local machine carries the plugin, the configuration, and the daemon that
holds the connection open.

- herdr, on a build whose command line offers `herdr terminal session`.
- macOS or Linux on x86_64 or aarch64, because the installer fetches a
  prebuilt binary.
- The `herdr-mirror` plugin, installed and enabled.
- A `hosts.toml` file listing each remote you want to mirror.
- Non-interactive ssh key access outbound to every host in that file.

Check the stream support first, because a version number does not answer
this requirement clearly:

```bash
herdr terminal --help
```

The output must list a `session` subcommand. If it does not, the build is too
old and no amount of configuration helps.

### Requirements on the remote machine

The remote needs herdr and a way in. It does not need the plugin, a
configuration file, an open port, or any knowledge that mirroring exists.

- herdr installed, on a build that also offers `herdr terminal session`.
- A herdr server running, which is the requirement people miss.
- Your public key in `~/.ssh/authorized_keys`.
- `socat` or `python3`, but only if the ssh daemon refuses socket forwards.

The last item covers a transport fallback. The plugin reaches the remote
application programming interface (API) socket through an `ssh -L` forward by
default. Some ssh daemons accept the forward
and then never move a byte, so the plugin falls back to a relay over `ssh`
exec, which needs `socat` or `python3` on the remote. Almost every system has
one of them.

Keep both ends on the same herdr build. The streaming protocol is the moving
part, and a mismatch shows up as a version complaint from the daemon rather
than a broken pane.

## Setting up key-based access

The plugin runs unattended, so it cannot answer a password prompt. Its access
test is exact:

```bash
ssh -o BatchMode=yes homelab true
```

That command must exit zero and print nothing. A dedicated key keeps this
access separate from your general ssh identity, which means you can revoke it
by deleting one line on the remote.

Generate the key on the local machine:

```bash
ssh-keygen -t ed25519 -f ~/.ssh/id_ed25519_herdr -N "" -C "herdr-mirror"
```

The empty passphrase is a real trade-off, not an oversight. A daemon that
reconnects on its own cannot prompt you, so the choice is an unencrypted key
or a passphrase held by an agent that must stay loaded. On macOS the agent
route works well with `UseKeychain yes` and `AddKeysToAgent yes`. The
unencrypted key is simpler and survives agent problems, at the cost that
anyone who reads the file gains shell access to the remote.

Copy the public half to the remote. This step prompts for the remote account
password, so run it yourself in a terminal:

```bash
ssh-copy-id -i ~/.ssh/id_ed25519_herdr.pub user@homelab
```

Then name the target in `~/.ssh/config` so the dedicated key is always the one
offered:

```
Host herdr-homelab homelab
    HostName homelab.lan
    User user
    IdentityFile ~/.ssh/id_ed25519_herdr
    IdentitiesOnly yes
```

`IdentitiesOnly yes` prevents a confusing authentication failure. Without it,
ssh offers every identity the agent holds, and a server with a low
`MaxAuthTries` can reject you before it reaches the right key.

Now run the access test again. Nothing later works until it passes silently.

## Keeping the remote server alive

A herdr server on the remote is a requirement, not a detail, and a server
started by hand disappears at the next reboot. A systemd user unit fixes both
problems.

Write `~/.config/systemd/user/herdr.service` on the remote:

```ini
[Unit]
Description=herdr server
After=network.target

[Service]
Type=simple
ExecStart=/home/user/.local/bin/herdr server
Restart=on-failure
RestartSec=5

[Install]
WantedBy=default.target
```

Use an absolute path in `ExecStart`. Systemd does not read your shell profile,
so a bare `herdr` fails when the binary lives in `~/.local/bin`. Find the real
path with `command -v herdr`.

Enable and start it:

```bash
systemctl --user daemon-reload
systemctl --user enable --now herdr.service
herdr status server
```

The status output should report `status: running` along with a protocol
number and a socket path.

One step remains, and it needs root:

```bash
sudo loginctl enable-linger user
```

Lingering keeps the systemd user manager running when you have no login
session on the machine. Without it, the user manager exits after your last
session closes and takes the herdr server with it. The setup appears to work
for a while, because the mirror daemon keeps connecting over ssh and creating
sessions, then fails after a reboot. Enable lingering and the problem never
appears.

## Installing and configuring the plugin

Everything in this section happens on the local machine.

```bash
herdr plugin install nikok6/herdr-mirror
herdr server reload-config
```

The install prints a preview of the actions and event hooks the plugin
registers, then builds the binary. It also links a command
at `~/.local/bin/herdr-mirror`, which gives shell use and key bindings one
stable path that survives updates.

Next, list your hosts:

```toml
[hosts.homelab]
target = "herdr-homelab"
```

The key on the left, `homelab`, becomes the sidebar prefix, so mirrored
workspaces appear as `homelab: <name>`. The `target` value accepts anything
ssh accepts, which includes an alias from `~/.ssh/config`. Pointing it at the
alias rather than at `user@host` guarantees the dedicated key applies.

The file belongs at `~/.config/herdr-mirror/hosts.toml`, and that path is
literal. The plugin does not honour `XDG_CONFIG_HOME`, so a configuration
directory relocated by that variable is not searched. This matters if you keep
your configuration in a repository and point `XDG_CONFIG_HOME` at it, which is
a common dotfiles pattern. Run `herdr-mirror status` to see the exact paths it
searches and the file it loaded.

## Starting the connection

There is no connect command, which surprises most people. Three layers stack
up, and each one only needs the layer under it:

1. **The remote server**: a running herdr server publishes an API socket. The
   plugin reads workspace and pane state from it.
2. **The transport**: the local daemon opens an ssh master connection, then
   forwards that API socket over it. The `api_transport` setting selects the
   method, and its default of `auto` tries the socket forward first and falls
   back to the exec relay.
3. **The daemon**: one local process reconciles remote workspaces into local
   mirrors and pushes agent status into the sidebar.

Only the third layer needs starting, and it starts itself. The default
`autostart = true` means that focusing any workspace starts the daemon. To
start or resume it by hand:

```bash
herdr-mirror start
```

Reconnection is automatic. The daemon retries on a ladder rather than giving
up, so a remote that reboots comes back on its own. A manual `herdr-mirror
pause` is sticky until you run `start` again, while a crash recovers at the
next workspace focus.

## Verifying the setup

Work through these checks in order. Each one isolates a different layer, so
the first failure tells you where the problem lives.

1. Confirm silent key access with `ssh -o BatchMode=yes homelab true`.
2. Confirm the remote server with `ssh homelab 'herdr status server'`.
3. Confirm the local server with `herdr status server`.
4. Confirm the plugin loaded with `herdr-mirror status`.
5. Create a workspace on the remote and watch it appear locally.

The fourth check is the informative one. A healthy daemon reports the host as
connected and prints the recent log:

```
daemon: running (pid 45137)
config: /Users/user/.config/herdr-mirror/hosts.toml
host homelab (herdr-homelab): 0 mirror workspaces, 0 mirror panes
recent log:
  2026-08-14T11:35:25.997Z [homelab] connected and synced
```

Zero mirror workspaces is correct on a fresh remote server, not a fault. The
plugin mirrors the workspaces that exist, and a new server holds none. Create
something for it to mirror:

```bash
ssh homelab 'herdr workspace create --label mirror-test --no-focus'
```

Within a few seconds the daemon log records the result, and `homelab:
mirror-test` appears in the local sidebar:

```
2026-08-14T11:38:41.106Z creating mirror workspace homelab: mirror-test
host homelab (herdr-homelab): 1 mirror workspaces, 1 mirror panes
```

## Reading the daemon log when it fails

The daemon log names the layer that failed, which makes it faster than
guessing. Three messages cover most first-time setups.

**`ssh master to user@host failed: Permission denied (publickey,password)`**
tells you the transport layer cannot authenticate. The key is missing from the
remote, or ssh offers the wrong identity. Reproduce it outside the plugin with
`ssh -o BatchMode=yes homelab true`, which fails the same way and reports more
detail with `-v`.

**`remote herdr server is not running`** tells you the transport works and the
remote server does not. Authentication has already succeeded at this point, so
this message is progress. Check the systemd unit with
`systemctl --user status herdr.service` on the remote.

**`connected and synced`** with zero mirrors tells you everything works and
the remote has no workspaces yet. Create one and watch the count change.

A renamed host key needs a daemon restart, because the running daemon holds
the loaded configuration. Run `herdr-mirror pause` followed by
`herdr-mirror start`, then check that the log lines carry the new prefix.

## After the first connection

Nothing on the local machine needs starting a second time. The daemon owns
reconnection, so a remote that reboots returns on its own with the same
workspace and pane counts. Reach for `herdr-mirror start` only when
`herdr-mirror status` reports the daemon stopped or paused.

Working inside a mirror has its own rules, and they are the subject of the
second part: [Working inside a herdr mirror]({filename}/posts/2026-09-19_herdr-mirror-working-inside.md).
