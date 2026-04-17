Title: Proxmox: Disable root@pam Login and Create a Sudo User
Date: 2026-04-17
Category: Hardware & Homelab
Tags: Proxmox, Security, Linux, Homelab, Virtualisation
Slug: proxmox-disable-root-login-sudo-user
Author: morganp
Summary: How to harden a Proxmox VE host by disabling direct root@pam login, creating a named admin user dave@pam, and granting it passwordless sudo access.
Status: published

Out of the box, Proxmox VE only has the `root@pam` account. Logging in directly as root is convenient during initial setup, but it is a bad habit to keep. This post walks through creating a named PAM user, granting it sudo access, and then disabling root login via both SSH and the web UI.

## Why Bother

- Audit logs become meaningful. `root` in auth logs could be anyone; `dave` is traceable.
- SSH brute-force tools target `root` first. Disabling it removes the most-attacked entry point.
- Sudo with `NOPASSWD` for specific commands is still safer than a permanent root shell.

## 1. Create the System User

Log in as root on the Proxmox host (via console or SSH) and add the new UNIX account:

```bash
useradd -m -s /bin/bash dave
passwd dave
```

`-m` creates a home directory. Set a strong password when prompted.

## 2. Install sudo

Proxmox minimal installs may not include sudo:

```bash
apt update && apt install -y sudo
```

## 3. Grant sudo Access

Add `dave` to the `sudo` group, which is already configured in `/etc/sudoers` to allow full sudo:

```bash
usermod -aG sudo dave
```

To verify the group membership took effect:

```bash
id dave
```

You should see `sudo` in the groups list.

## 4. Register the User in Proxmox

Proxmox has its own user database separate from the Linux PAM database. The `@pam` realm bridges them, but you still need to add the user in the Proxmox layer.

**Via the web UI:** Datacenter > Permissions > Users > Add

- User: `dave`
- Realm: `pam`
- Enable: checked

**Via the CLI:**

```bash
pveum user add dave@pam
```

## 5. Assign a Proxmox Role

The user needs at least one permission to do anything useful. For a full admin, assign the built-in `Administrator` role at the root path `/`:

```bash
pveum acl modify / -user dave@pam -role Administrator
```

For a more restricted setup, use `PVEAdmin` (everything except node-level config) or define a custom role.

## 6. Test the New Account

Before locking out root, confirm the new account works end to end:

1. Open a new terminal (do not close the existing root session).
2. SSH in as `dave`:

    ```bash
    ssh dave@<proxmox-ip>
    ```

3. Confirm sudo works:

    ```bash
    sudo -i
    ```

4. Log in to the Proxmox web UI at `https://<proxmox-ip>:8006` as `dave@pam`.

Do not proceed to the next step until all three work.

## 7. Disable root SSH Login

Edit `/etc/ssh/sshd_config`:

```bash
sudo nano /etc/ssh/sshd_config
```

Find or add the following line:

```
PermitRootLogin no
```

Reload SSH without dropping existing connections:

```bash
sudo systemctl reload sshd
```

Verify by attempting `ssh root@<proxmox-ip>` -- it should now be refused.

## 8. Disable root@pam in the Proxmox Web UI

Even with SSH root login disabled, `root@pam` can still authenticate through the Proxmox web UI. To disable it:

**Via the web UI:** Datacenter > Permissions > Users > select `root` > Edit > uncheck Enable

**Via the CLI:**

```bash
pveum user modify root@pam --enable 0
```

This does not delete root or change anything at the Linux level. It only prevents login through the Proxmox authentication stack.

> **Note:** The Linux `root` account remains intact. You can always recover it from the physical console or by re-enabling `root@pam` through the CLI as your admin user with sudo.

## Verification Checklist

| Check | Command | Expected Result |
|---|---|---|
| dave SSH login | `ssh dave@<ip>` | Login prompt |
| dave sudo | `sudo -i` | Root shell |
| dave web UI | Browser `https://<ip>:8006` | Logged in as dave@pam |
| root SSH blocked | `ssh root@<ip>` | Permission denied |
| root web UI blocked | Browser login as root@pam | Login rejected |

## Summary

| Step | What It Does |
|---|---|
| `useradd` | Creates the Linux PAM account |
| `apt install sudo` | Ensures sudo is present |
| `usermod -aG sudo` | Grants full sudo via the sudo group |
| `pveum user add` | Registers the account in Proxmox |
| `pveum acl modify` | Assigns a Proxmox role |
| `PermitRootLogin no` | Blocks root SSH |
| `pveum user modify root@pam --enable 0` | Blocks root Proxmox web UI login |
