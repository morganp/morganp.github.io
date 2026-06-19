# Installing Homebrew on a Debian 13 (Trixie) LXC Container

This tutorial documents a working, verified installation of Homebrew (Linuxbrew) on a
Debian 13 "trixie" LXC container. Every step reflects what was actually done on this system;
nothing has been invented or copied from generic guides without verification.

**Tested environment:**
- Debian GNU/Linux 13 (trixie), amd64
- LXC unprivileged container
- Homebrew 5.0.15
- Primary non-root user: `morgan` (uid=1000)

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Installation Steps](#2-installation-steps)
3. [Per-User Shell Setup](#3-per-user-shell-setup)
4. [Verification](#4-verification)
5. [Adding Future Users](#5-adding-future-users)
6. [Troubleshooting](#6-troubleshooting)

---

## 1. Prerequisites

### System packages

The Homebrew installer requires these packages. Install them as root before running the
installer:

```bash
apt-get update
apt-get install -y build-essential git curl file procps
```

Verify all five are present:

```
ii  build-essential 12.12              amd64  Informational list of build-essential packages
ii  curl            8.14.1-2+deb13u2   amd64  command line tool for transferring data with URL syntax
ii  file            1:5.46-5           amd64  Recognize the type of data in a file using "magic" numbers
ii  git             1:2.47.3-0+deb13u1 amd64  fast, scalable, distributed revision control system
ii  procps          2:4.0.4-9          amd64  /proc file system utilities
```

### PATH gotcha: /usr/sbin must be in root's PATH

On Debian 13, `/usr/sbin` is **not** automatically in the PATH of non-login shells (including
those invoked by `su` without `-l`). The installer calls `useradd`, which lives at
`/usr/sbin/useradd`. If `/usr/sbin` is missing from your PATH the installer will fail with a
confusing "command not found" error.

Before running the installer, confirm your PATH includes `/usr/sbin`:

```bash
echo $PATH
```

If it does not, prepend it for the session:

```bash
export PATH="/usr/sbin:$PATH"
```

Or simply run the installer from a full login shell (`su -` rather than `su`).

---

## 2. Installation Steps

All steps in this section are run as **root**.

### Step 1 — Create the dedicated `linuxbrew` group

Homebrew on Linux uses a shared group so that multiple users can write to the installation
prefix. Create it before the installer runs so you control its GID:

```bash
groupadd linuxbrew
```

### Step 2 — Pre-create the Homebrew prefix directory

The Homebrew installer expects to own `/home/linuxbrew/.linuxbrew`. In an LXC container the
installer sometimes cannot create `/home/linuxbrew` itself due to ownership constraints on
`/home`. Pre-create it and set the correct ownership **before** running the installer:

```bash
mkdir -p /home/linuxbrew/.linuxbrew
chown -R morgan:linuxbrew /home/linuxbrew
chmod 2775 /home/linuxbrew
chmod 2775 /home/linuxbrew/.linuxbrew
```

The `2775` mode sets the **setgid bit** (`s`) on the directory. This causes all files and
subdirectories created inside to inherit the `linuxbrew` group automatically, which is what
allows multiple users to install and update packages.

After this step, `ls -la /home/linuxbrew/` should show:

```
drwxrwxr-x  3 morgan linuxbrew 4096 Feb 25 15:31 .
drwxr-xr-x  4 root   root      4096 Feb 25 15:31 ..
drwxrwsr-x 14 morgan linuxbrew 4096 Feb 25 15:31 .linuxbrew
```

And `stat /home/linuxbrew/.linuxbrew` confirms the setgid bit:

```
Access: (2775/drwxrwsr-x)  Uid: ( 1000/  morgan)   Gid: ( 1001/linuxbrew)
```

### Step 3 — Add the primary user to the linuxbrew group

```bash
usermod -aG linuxbrew morgan
```

The `-a` flag is critical — without it `usermod -G` **replaces** all supplementary groups
instead of appending to them.

### Step 4 — Run the Homebrew installer as the primary user

Switch to the non-root user and run the official installer. Do **not** run it as root:

```bash
su - morgan
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Because the prefix directory already exists and is writable by the `linuxbrew` group (and
`morgan` is a member), the installer will populate it without needing to create it or change
system-level ownership.

### Step 5 — Create the system-wide profile.d script

To activate Homebrew automatically for every user who logs in, create a shell script in
`/etc/profile.d/` as root:

```bash
cat > /etc/profile.d/homebrew.sh << 'EOF'
#!/bin/bash
if [ -d "/home/linuxbrew/.linuxbrew" ]; then
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi
EOF
chmod +x /etc/profile.d/homebrew.sh
```

This is exactly the file present on this system:

```bash
# /etc/profile.d/homebrew.sh
#!/bin/bash
if [ -d "/home/linuxbrew/.linuxbrew" ]; then
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi
```

The `if` guard makes the script safe on systems where the prefix does not exist (e.g., before
installation, or if the directory is removed).

---

## 3. Per-User Shell Setup

The `/etc/profile.d/homebrew.sh` script runs automatically for **login shells**. This covers
`su - username`, SSH logins, and console logins.

For interactive non-login shells (e.g., a new terminal tab that sources `~/.bashrc` instead of
`~/.bash_profile`), a user may need to add the following to their `~/.bashrc`:

```bash
# Homebrew (Linuxbrew)
if [ -d "/home/linuxbrew/.linuxbrew" ]; then
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi
```

`brew shellenv` sets these environment variables:

| Variable | Value |
|---|---|
| `HOMEBREW_PREFIX` | `/home/linuxbrew/.linuxbrew` |
| `HOMEBREW_CELLAR` | `/home/linuxbrew/.linuxbrew/Cellar` |
| `HOMEBREW_REPOSITORY` | `/home/linuxbrew/.linuxbrew/Homebrew` |
| `PATH` | prepends `/home/linuxbrew/.linuxbrew/bin` and `.../sbin` |
| `MANPATH` | prepends `.../share/man` |
| `INFOPATH` | prepends `.../share/info` |

---

## 4. Verification

### Confirm the installation prefix layout

```bash
ls -la /home/linuxbrew/.linuxbrew/
```

Expected output (all entries owned by `morgan:linuxbrew`, setgid `s` visible):

```
total 56
drwxrwsr-x 14 morgan linuxbrew 4096 Feb 25 15:31 .
drwxrwxr-x  3 morgan linuxbrew 4096 Feb 25 15:31 ..
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 Caskroom
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 Cellar
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 Frameworks
drwxrwsr-x 15 morgan linuxbrew 4096 Feb 25 15:31 Homebrew
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 bin
drwxrwsr-x  3 morgan linuxbrew 4096 Feb 25 15:32 etc
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 include
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 lib
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 opt
drwxrwsr-x  2 morgan linuxbrew 4096 Feb 25 15:31 sbin
drwxrwsr-x  6 morgan linuxbrew 4096 Feb 25 15:32 share
drwxrwsr-x  3 morgan linuxbrew 4096 Feb 25 15:31 var
```

### Check the Homebrew version

```bash
su - morgan -c 'brew --version'
```

```
Homebrew 5.0.15
```

### Run brew doctor

```bash
su - morgan -c 'brew doctor'
```

```
Your system is ready to brew.
```

### Confirm group membership

```bash
getent group linuxbrew
# linuxbrew:x:1001:morgan

id morgan
# uid=1000(morgan) gid=1000(morgan) groups=1000(morgan),100(users),1001(linuxbrew)
```

### Test installing a package (dry run)

```bash
su - morgan -c 'brew install --dry-run hello'
```

```
==> Would install 1 formula:
hello
```

---

## 5. Adding Future Users

When a new user needs Homebrew access:

```bash
# As root — add the new user to the linuxbrew group
usermod -aG linuxbrew newuser
```

The user must log out and back in (or start a new login shell) for the group change to take
effect. The `/etc/profile.d/homebrew.sh` script will activate `brew` for them automatically
on their next login. No other changes are needed.

To verify the new user can reach Homebrew:

```bash
su - newuser -c 'brew --version'
```

---

## 6. Troubleshooting

### `brew: command not found` in a non-login shell

The `/etc/profile.d/homebrew.sh` script only runs in login shells. In a non-login shell
(typical terminal emulators, `su username` without the `-`), Homebrew will not be on the PATH.

Fix: source the script manually, or add the `eval` line to `~/.bashrc` as shown in
[Section 3](#3-per-user-shell-setup).

Quick test — if this works but `brew` does not:

```bash
/home/linuxbrew/.linuxbrew/bin/brew --version
```

then the issue is purely PATH/environment, not the installation.

### `useradd: command not found` during installation

`useradd` lives at `/usr/sbin/useradd`. On Debian 13, `/usr/sbin` is not in the PATH of
non-login root shells. Run the installer from a full login shell:

```bash
su -        # note the hyphen — this gives a login shell with /usr/sbin in PATH
```

Or prepend it explicitly before running the installer:

```bash
export PATH="/usr/sbin:$PATH"
```

### Installer fails to create `/home/linuxbrew`

In LXC containers, the installer may not be able to create the prefix directory itself because
`/home` is owned by `root:root` with mode `755`. The installer does not have write access to
`/home` when running as a non-root user.

Solution: pre-create the directory as root before running the installer (see
[Step 2](#step-2--pre-create-the-homebrew-prefix-directory)).

### Permission denied errors when running `brew install`

The user must be in the `linuxbrew` group **and** must have started a new session after being
added. Check:

```bash
id          # linuxbrew should appear in the groups list
```

If `linuxbrew` is absent, either the `usermod -aG linuxbrew username` step was skipped, or
the user has not logged out and back in since being added.

### `brew doctor` reports warnings about `/usr/local`

On Linux, Homebrew uses `/home/linuxbrew/.linuxbrew` as its prefix, not `/usr/local`. Warnings
about `/usr/local` being absent or not owned by the current user are normal and harmless on a
Linux installation.

---

## Quick-Reference: Full Root-Side Install Sequence

```bash
# 1. Install dependencies
apt-get update && apt-get install -y build-essential git curl file procps

# 2. Ensure /usr/sbin is in PATH (run as login shell or set manually)
export PATH="/usr/sbin:$PATH"

# 3. Create the linuxbrew group
groupadd linuxbrew

# 4. Pre-create the prefix and set ownership/permissions
mkdir -p /home/linuxbrew/.linuxbrew
chown -R morgan:linuxbrew /home/linuxbrew
chmod 2775 /home/linuxbrew
chmod 2775 /home/linuxbrew/.linuxbrew

# 5. Add the primary user to the group
usermod -aG linuxbrew morgan

# 6. Run the installer as the non-root user
su - morgan -c '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'

# 7. Install the system-wide profile.d activation script
cat > /etc/profile.d/homebrew.sh << 'EOF'
#!/bin/bash
if [ -d "/home/linuxbrew/.linuxbrew" ]; then
    eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"
fi
EOF
chmod +x /etc/profile.d/homebrew.sh

# 8. Verify
su - morgan -c 'brew --version && brew doctor'
```
