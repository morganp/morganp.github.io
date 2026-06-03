Title: Building a Personal MCP Server for Your Second Brain
Date: 2026-06-03
Category: Hardware & Homelab
Tags: MCP, Node.js, homelab, Claude, supergateway, git
Author: morganp
Status: published
Summary: How to build a self-hosted MCP server that exposes a markdown vault as Claude tools — list projects, search notes, write entries, and commit changes, all from a conversation.
Slug: building-a-personal-mcp-server

Claude can do more than answer questions — it can read and write files on a server you control. A [Model Context Protocol](https://modelcontextprotocol.io) (MCP) server is the bridge. This post covers building a personal MCP server that exposes a markdown vault as tools: list projects, search notes, create entries, and commit changes — all from a Claude conversation.

---

## What It Is

The vault is a git repository of markdown files organised around the PARA method (Projects, Areas, Resources, Archive). The MCP server is a Node.js process that reads and writes those files in response to tool calls. Claude never sees the raw filesystem — it sees a curated set of typed tools with well-defined behaviour.

The key design principle: **progressive disclosure**. Don't give Claude a raw file API. Give it typed tools that encode domain knowledge — what a project file looks like, where the frontmatter ends, which fields are indexable.

---

## The File Structure

```
vault/
  projects/       ← active work, one file per project
  actions/        ← GTD next-actions with stage/due
  areas/          ← ongoing responsibilities
  reference/      ← stable reference material
  archive/
    projects/
    actions/
    area/
  glossary.md     ← grep-only, grows to ~1500+ lines
  journal/
    2026.md
  memory/         ← always-on agent brief, loaded every session
  mcp/            ← the MCP server code lives here
```

Each `projects/<id>.md` has frontmatter: `domain`, `status`, `started`, `last_touched`, `next_action`. These are the indexed fields — the tools scan frontmatter without reading bodies.

---

## The Tools

### Index tools (frontmatter-only scans)

```
list_projects(status?, domain?, include_archive?)
list_actions(stage?, domain?, due_before?, include_archive?)
list_areas(domain?, include_archive?)
```

These walk their directory, parse only the frontmatter block from each file, and return one summary line per entry. The LLM starts here every session — it gets an overview without reading thousands of lines of content.

`include_archive` defaults to `false`. Archive-excluded-by-default keeps lists fast and focused on active material. Pass `include_archive: true` only when you need historical entries.

### Read and search

```
read_text(path)                          ← full file
grep(pattern, path?, include_archive?)   ← regex search across the vault
```

`grep` is the backbone of reference and fact lookup. The glossary file grows to thousands of lines — never bulk-read it; always grep it.

### Write tools

```
write_text(path, content)
append(path, content)
edit(path, old_string, new_string)
```

`edit` does an exact find/replace of the first match. The server never rewrites a whole file when you're changing one line — it's faster and produces cleaner diffs in git history.

### Archive tools

```
archive_project(id)
archive_action(id)
archive_area(id)
```

Move the file to `archive/<type>/`, flip `status` to `done`. No manual file moves or editor needed.

---

## Auto-Commit on Write

Every write tool ends with a git commit and push:

```javascript
await git(["-C", BRAIN_ROOT, "add", "-A"]);
await git(["-C", BRAIN_ROOT, "commit", "-m", `mcp: ${summary}`]);
await git(["-C", BRAIN_ROOT, "push"]);
```

This gives you a full history of every change Claude made, browsable in any git client. It also means the vault stays in sync with the remote backup — no separate sync step needed.

**Gotcha: systemd doesn't set HOME.** When the service runs as root, `git push` fails with `fatal: unable to set up default path` because `/root/.gitconfig` and `.git-credentials` aren't found. Fix this with a systemd drop-in:

`/etc/systemd/system/vault-mcp.service.d/home.conf`:

```ini
[Service]
Environment=HOME=/root
```

Without this, writes succeed locally but the push silently fails — the vault appears to work but isn't backing up.

---

## The Sync Timer

A `brain-sync.timer` runs every 10 minutes as a backstop:

```bash
git -C $BRAIN_ROOT pull --rebase --autostash
git -C $BRAIN_ROOT push
```

This handles the case where a push failed mid-session. The remote git repo is the source of truth for backup; the server is the source of truth for content.

---

## supergateway

The MCP server is a Node.js stdio process. [supergateway](https://github.com/supercorp-ai/supergateway) bridges it to a Streamable HTTP endpoint so it can be reached over the network:

```bash
supergateway --stdio 'node /opt/brain/mcp/server.js' \
  --port 3001 --outputTransport streamableHttp \
  --streamableHttpPath /mcp
```

Claude Code connects via `~/.mcp.json`:

```json
{
  "brain": {
    "type": "http",
    "url": "http://your-server:3001/mcp"
  }
}
```

---

## The systemd Service

`/etc/systemd/system/vault-mcp.service`:

```ini
[Unit]
Description=Vault MCP Server
After=network.target

[Service]
Type=simple
ExecStartPre=/bin/bash -c 'cd /opt/brain/mcp && npm install --silent'
ExecStart=/usr/bin/supergateway \
  --stdio 'node /opt/brain/mcp/server.js' \
  --port 3001 \
  --outputTransport streamableHttp \
  --streamableHttpPath /mcp
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=BRAIN_ROOT=/opt/brain

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now vault-mcp
```

`ExecStartPre` runs `npm install` on every start — no manual dependency management after updates. Intentionally **no** `git pull` here: the service might start during a write, and a pull could clobber in-flight changes.

---

## What You Get

Once running, a session looks like:

```
list_projects(status="active", domain="code")
→ 12 projects, one line each

read_text("projects/my-project.md")
→ full file contents

edit("projects/my-project.md",
     old_string="next_action: review",
     new_string="next_action: ship v1")
→ committed and pushed
```

No file paths to remember, no git commands to run, no editor to open. The vault stays in sync and the history tells you exactly what changed and when.

The next post covers adding OAuth authentication to this server so it can be safely exposed over the internet and connected to Claude.ai on mobile.
