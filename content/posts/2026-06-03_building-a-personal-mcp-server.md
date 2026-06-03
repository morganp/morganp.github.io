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
  actions/            ← GTD next-actions, one file each
    <id>.md           ← frontmatter: id, stage, due, tags
    _template.md
  areas/              ← ongoing responsibilities / long-term goals
    <id>.md
    _template.md
  archive/
    actions/          ← done/cancelled actions (search-excluded by default)
    area/             ← retired areas
    projects/         ← completed projects
  blog/               ← longer-form research and series notes
  deploy/             ← systemd units and migration scripts
    vault-mcp.service
    brain-sync.service
    brain-sync.timer
  drafts/             ← blog post drafts (blog_draft tool writes here)
  journal/
    2026.md
  mcp/                ← MCP server code
    server.js         ← main server (see full source below)
    oauth-server.js   ← minimal OAuth 2.1 AS (covered in next post)
    package.json
    README.md
  memory/             ← always-on agent brief, loaded every session
    INDEX.md
  projects/           ← active work, one file per project
    <id>.md           ← frontmatter: id, domain, status, last_touched, next_action
    _template.md
  reference/          ← stable reference material
  CLAUDE.md           ← instructions for Claude Code sessions
  glossary.md         ← acronym table, grep-only (~1500+ lines)
  todo.md             ← protected, cannot be deleted via MCP
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

## Exposing the Server: Cloudflare Tunnel

supergateway listens on a local port. To reach it from outside your network — for example from Claude.ai on mobile — you need to expose it. The cleanest option for a home server is a [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/), which creates an outbound-only connection from your server to Cloudflare's edge. No open inbound ports, no port-forwarding rules.

### Setup

Install `cloudflared` on the same host as the MCP server:

```bash
# Debian/Ubuntu
curl -L https://pkg.cloudflare.com/cloudflare-main.gpg | tee /usr/share/keyrings/cloudflare-main.gpg > /dev/null
echo 'deb [signed-by=/usr/share/keyrings/cloudflare-main.gpg] https://pkg.cloudflare.com/cloudflared any main' | tee /etc/apt/sources.list.d/cloudflared.list
apt update && apt install cloudflared
```

Authenticate and create the tunnel from the [Zero Trust dashboard](https://one.dash.cloudflare.com/) (Networks → Tunnels → Create tunnel), or via CLI:

```bash
cloudflared tunnel login
cloudflared tunnel create mcp-tunnel
```

Configure the tunnel to route traffic to the local MCP port:

`/etc/cloudflared/config.yml`:

```yaml
tunnel: <tunnel-id>
credentials-file: /root/.cloudflared/<tunnel-id>.json

ingress:
  - hostname: your-mcp-host.example.com
    service: http://localhost:3001
  - service: http_status:404
```

Add the DNS record and start the tunnel as a system service:

```bash
cloudflared tunnel route dns mcp-tunnel your-mcp-host.example.com
cloudflared service install
systemctl enable --now cloudflared
```

The MCP server is now reachable at `https://your-mcp-host.example.com/mcp` without any firewall changes.

### Connecting Claude Code via the Public URL

Once the tunnel is running, update `~/.mcp.json` to use the public HTTPS URL instead of the local port:

```json
{
  "brain": {
    "type": "http",
    "url": "https://your-mcp-host.example.com/mcp"
  }
}
```

This is also the URL you'd add as a remote MCP connector in Claude.ai on mobile.

### Security Warning: the Server is Unauthenticated at This Point

The tunnel exposes the MCP server to the public internet with no authentication. Anyone who discovers the URL can read and write every file in the vault. This is an accepted short-term risk for initial setup and testing, but should not be left in production.

There are two ways to close this gap:

**Cloudflare Zero Trust Access** — gate the tunnel at the edge before traffic reaches your server. In the Zero Trust dashboard: Access → Applications → Add an application → Self-hosted, point it at your tunnel hostname. You can restrict by email, IP, or issue service tokens to specific clients. This works today and requires no changes to the MCP server itself.

**OAuth on the MCP server** — the approach covered in the next post. A minimal Node.js OAuth server sits behind nginx; nginx validates the bearer token on every `/mcp` request. This is the right long-term solution and is what Claude.ai's MCP connector expects when you add a remote server in the UI.

The two are complementary — Cloudflare Access as a coarse outer gate, OAuth as the fine-grained inner check — but for a personal single-user server, either one alone is sufficient.

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

---

## Full Source: server.js

<details>
<summary><code>mcp/server.js</code> — v0.4.0</summary>

```javascript
#!/usr/bin/env node
// brain-mcp: custom MCP server for the personal-brain vault.
//
// Design goal: progressive disclosure. Tools return the minimum tokens needed
// at each tier:
//   tier 1  list_projects / list_actions / list_areas  -> frontmatter summary only
//   tier 2  read_text      -> one full file, on demand
//   tier 3  grep           -> matching lines only, from glossary/reference/etc
//
// All paths are vault-relative and sandboxed to BRAIN_ROOT.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { promises as fs } from "node:fs";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const ROOT = path.resolve(process.env.BRAIN_ROOT || process.argv[2] || process.cwd());

// Files grep/list walks skip. Binary + noise.
const SKIP_DIRS = new Set([".git", "node_modules", ".obsidian"]);
const BINARY_EXT = new Set([".pdf", ".epub", ".png", ".jpg", ".jpeg", ".gif", ".zip", ".db"]);
const GREP_LIMIT = 200; // max match lines returned, guards against accidental whole-vault dumps

// PARA buckets: live dir -> archive dir. One file per item, frontmatter = index.
const ARCHIVE_MAP = {
  projects: "archive/projects",
  actions: "archive/actions",
  areas: "archive/area",
};

// Resolve a vault-relative path and refuse anything that escapes ROOT.
function resolveInRoot(rel) {
  const abs = path.resolve(ROOT, rel || ".");
  if (abs !== ROOT && !abs.startsWith(ROOT + path.sep)) {
    throw new Error(`path escapes vault root: ${rel}`);
  }
  return abs;
}

// Parse a leading YAML frontmatter block into a flat key->string map.
// Intentionally simple: our frontmatter is flat scalars, no nested YAML.
function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end === -1) return {};
  const block = text.slice(text.indexOf("\n") + 1, end);
  const out = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) out[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
  }
  return out;
}

// Flip status/stage to archived and stamp an archived date into frontmatter.
function stampArchived(text) {
  const today = new Date().toISOString().slice(0, 10);
  text = text.replace(/^status:[ \t].*$/m, "status: archived");
  text = text.replace(/^stage:[ \t].*$/m, "stage: archived");
  if (text.startsWith("---")) {
    const end = text.indexOf("\n---", 3);
    if (end !== -1 && !/^archived:/m.test(text.slice(0, end))) {
      text = text.slice(0, end) + `\narchived: ${today}` + text.slice(end);
    }
  }
  return text;
}

async function* walk(dir) {
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      yield* walk(path.join(dir, e.name));
    } else if (e.isFile()) {
      if (BINARY_EXT.has(path.extname(e.name).toLowerCase())) continue;
      yield path.join(dir, e.name);
    }
  }
}

// Commit and push a single file after a write operation.
async function gitCommitAndPush(rel, action) {
  try {
    await execFileAsync("git", ["-C", ROOT, "add", rel]);
    await execFileAsync("git", ["-C", ROOT, "commit", "-m", `mcp: ${action} ${rel}`]);
    await execFileAsync("git", ["-C", ROOT, "pull", "--rebase", "--autostash", "origin", "main"]);
    await execFileAsync("git", ["-C", ROOT, "push", "origin", "main"]);
    return " — pushed";
  } catch (err) {
    const msg = err.stderr || err.message || String(err);
    if (msg.includes("nothing to commit")) return "";
    return ` — push failed: ${msg.trim().split("\n")[0]}`;
  }
}

// Commit a move (new file added, old path deleted) in one commit.
async function gitCommitMove(oldRel, newRel, action) {
  try {
    await execFileAsync("git", ["-C", ROOT, "add", newRel]);
    await execFileAsync("git", ["-C", ROOT, "add", "-A", "--", oldRel]);
    await execFileAsync("git", ["-C", ROOT, "commit", "-m", `mcp: ${action} ${oldRel} -> ${newRel}`]);
    await execFileAsync("git", ["-C", ROOT, "pull", "--rebase", "--autostash", "origin", "main"]);
    await execFileAsync("git", ["-C", ROOT, "push", "origin", "main"]);
    return " — pushed";
  } catch (err) {
    const msg = err.stderr || err.message || String(err);
    if (msg.includes("nothing to commit")) return "";
    return ` — push failed: ${msg.trim().split("\n")[0]}`;
  }
}

// Shared: move <kind>/<id>.md into its archive dir, flipping status/stage.
async function archiveItem(kind, id) {
  const srcRel = `${kind}/${id}.md`;
  const src = resolveInRoot(srcRel);
  let text;
  try {
    text = await fs.readFile(src, "utf8");
  } catch {
    return { content: [{ type: "text", text: `${srcRel} not found` }], isError: true };
  }
  text = stampArchived(text);
  const destRel = `${ARCHIVE_MAP[kind]}/${id}.md`;
  const dest = resolveInRoot(destRel);
  await fs.mkdir(path.dirname(dest), { recursive: true });
  await fs.writeFile(dest, text);
  await fs.unlink(src);
  const status = await gitCommitMove(srcRel, destRel, "archive");
  return { content: [{ type: "text", text: `archived ${srcRel} -> ${destRel}${status}` }] };
}

const server = new McpServer({ name: "brain-mcp", version: "0.4.0" });

// ---- tier 1: derived indexes -----------------------------------------------
server.registerTool(
  "list_projects",
  {
    title: "List projects",
    description:
      "Derived project index. Scans frontmatter of projects/*.md (skips _template) and returns one summary line per project. Reads frontmatter only, never bodies. Start here every session.",
    inputSchema: {
      status: z.enum(["active", "idle", "done"]).optional().describe("filter by status"),
      domain: z.string().optional().describe("filter by domain, e.g. woodwork, code, 3d, trip, work"),
      include_archive: z.boolean().optional().describe("also scan archive/projects/ (default false)"),
    },
  },
  async ({ status, domain, include_archive }) => {
    const dirs = [resolveInRoot("projects")];
    if (include_archive) dirs.push(resolveInRoot("archive/projects"));
    const lines = [];
    for (const dir of dirs) {
      for await (const file of walk(dir)) {
        const rel = path.relative(ROOT, file);
        if (path.basename(file) === "_template.md") continue;
        if (path.extname(file) !== ".md") continue;
        const fm = parseFrontmatter(await fs.readFile(file, "utf8"));
        if (!fm.id) continue;
        if (status && fm.status !== status) continue;
        if (domain && fm.domain !== domain) continue;
        lines.push(
          `${fm.id} | ${fm.domain || "?"} | ${fm.status || "?"} | touched ${fm.last_touched || "?"} | next: ${fm.next_action || "-"} | ${rel}`
        );
      }
    }
    lines.sort();
    return { content: [{ type: "text", text: lines.length ? lines.join("\n") : "(no projects match)" }] };
  }
);

server.registerTool(
  "list_actions",
  {
    title: "List actions",
    description:
      "Derived action index (GTD). Scans frontmatter of actions/*.md (skips _template), returns one line per action sorted by due date (undated last). Reads frontmatter only.",
    inputSchema: {
      stage: z.enum(["someday", "next", "waiting"]).optional().describe("filter by stage"),
      domain: z.string().optional().describe("filter by tag, e.g. 3d, workshop, code"),
      due_before: z.string().optional().describe("only actions with due <= this YYYY-MM-DD"),
      include_archive: z.boolean().optional().describe("also scan archive/actions/ (default false)"),
    },
  },
  async ({ stage, domain, due_before, include_archive }) => {
    const dirs = [resolveInRoot("actions")];
    if (include_archive) dirs.push(resolveInRoot("archive/actions"));
    const rows = [];
    for (const dir of dirs) {
      for await (const file of walk(dir)) {
        const rel = path.relative(ROOT, file);
        if (path.basename(file) === "_template.md") continue;
        if (path.extname(file) !== ".md") continue;
        const fm = parseFrontmatter(await fs.readFile(file, "utf8"));
        if (!fm.id) continue;
        if (stage && fm.stage !== stage) continue;
        if (domain && !(fm.tags || "").includes(domain)) continue;
        if (due_before && (!fm.due || fm.due > due_before)) continue;
        rows.push({
          due: fm.due || "~",
          line: `${fm.id} | ${fm.stage || "?"} | due ${fm.due || "-"} | tags ${fm.tags || "-"} | ${rel}`,
        });
      }
    }
    rows.sort((a, b) => (a.due < b.due ? -1 : a.due > b.due ? 1 : 0));
    return {
      content: [{ type: "text", text: rows.length ? rows.map((r) => r.line).join("\n") : "(no actions match)" }],
    };
  }
);

server.registerTool(
  "list_areas",
  {
    title: "List areas",
    description:
      "Derived area index. Scans frontmatter of areas/*.md (skips _template), one line per area of responsibility / long-term goal. Reads frontmatter only.",
    inputSchema: {
      domain: z.string().optional().describe("filter by domain"),
      include_archive: z.boolean().optional().describe("also scan archive/area/ (default false)"),
    },
  },
  async ({ domain, include_archive }) => {
    const dirs = [resolveInRoot("areas")];
    if (include_archive) dirs.push(resolveInRoot("archive/area"));
    const lines = [];
    for (const dir of dirs) {
      for await (const file of walk(dir)) {
        const rel = path.relative(ROOT, file);
        if (path.basename(file) === "_template.md") continue;
        if (path.extname(file) !== ".md") continue;
        const fm = parseFrontmatter(await fs.readFile(file, "utf8"));
        const id = fm.id || path.basename(file, ".md");
        lines.push(`${id} | ${fm.domain || "?"} | updated ${fm["last-updated"] || fm.last_touched || "?"} | ${rel}`);
      }
    }
    lines.sort();
    return { content: [{ type: "text", text: lines.length ? lines.join("\n") : "(no areas match)" }] };
  }
);

// ---- tier 2: read one file -------------------------------------------------
server.registerTool(
  "read_text",
  {
    title: "Read file",
    description: "Read a full vault file as text. Use after list_projects/grep narrows to one file.",
    inputSchema: { path: z.string().describe("vault-relative path, e.g. projects/woodwork-table.md") },
  },
  async ({ path: rel }) => {
    const text = await fs.readFile(resolveInRoot(rel), "utf8");
    return { content: [{ type: "text", text }] };
  }
);

// ---- tier 3: content search ------------------------------------------------
server.registerTool(
  "grep",
  {
    title: "Grep content",
    description:
      "Search file contents by regex, return matching lines as 'relpath:lineno: text'. Use for glossary/reference/fact lookups instead of reading whole files. Skips archive/ by default.",
    inputSchema: {
      pattern: z.string().describe("JavaScript regex, case-insensitive"),
      path: z.string().optional().describe("limit to this file or subdir (default whole vault)"),
      include_archive: z.boolean().optional().describe("also search archive/ (default false)"),
    },
  },
  async ({ pattern, path: rel, include_archive }) => {
    let re;
    try {
      re = new RegExp(pattern, "i");
    } catch (e) {
      return { content: [{ type: "text", text: `bad regex: ${e.message}` }], isError: true };
    }
    const start = resolveInRoot(rel);
    const stat = await fs.stat(start);
    let files = [];
    if (stat.isFile()) files.push(start);
    else for await (const f of walk(start)) files.push(f);

    const archiveAbs = resolveInRoot("archive");
    const startInArchive = start === archiveAbs || start.startsWith(archiveAbs + path.sep);
    if (!include_archive && !startInArchive) {
      files = files.filter((f) => !(f === archiveAbs || f.startsWith(archiveAbs + path.sep)));
    }

    const hits = [];
    for (const file of files) {
      if (hits.length >= GREP_LIMIT) break;
      const text = await fs.readFile(file, "utf8");
      const relp = path.relative(ROOT, file);
      text.split("\n").forEach((line, i) => {
        if (hits.length < GREP_LIMIT && re.test(line)) hits.push(`${relp}:${i + 1}: ${line.trim()}`);
      });
    }
    return {
      content: [
        { type: "text", text: hits.length ? hits.join("\n") + (hits.length >= GREP_LIMIT ? "\n(truncated)" : "") : "(no matches)" },
      ],
    };
  }
);

// ---- writes ----------------------------------------------------------------
server.registerTool(
  "append",
  {
    title: "Append to file",
    description: "Append text to a file (created if missing). For append-only data: journal lines, project Log entries.",
    inputSchema: {
      path: z.string().describe("vault-relative path"),
      text: z.string().describe("text to append; a trailing newline is added if absent"),
    },
  },
  async ({ path: rel, text }) => {
    const abs = resolveInRoot(rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.appendFile(abs, text.endsWith("\n") ? text : text + "\n");
    const status = await gitCommitAndPush(rel, "append");
    return { content: [{ type: "text", text: `appended to ${rel}${status}` }] };
  }
);

server.registerTool(
  "edit",
  {
    title: "Edit file",
    description: "Replace the first exact occurrence of old_string with new_string in a file. Targeted edit, no full rewrite.",
    inputSchema: {
      path: z.string(),
      old_string: z.string().describe("exact text to find (must be unique enough to match once)"),
      new_string: z.string(),
    },
  },
  async ({ path: rel, old_string, new_string }) => {
    const abs = resolveInRoot(rel);
    const text = await fs.readFile(abs, "utf8");
    const idx = text.indexOf(old_string);
    if (idx === -1) return { content: [{ type: "text", text: "old_string not found" }], isError: true };
    const next = text.slice(0, idx) + new_string + text.slice(idx + old_string.length);
    await fs.writeFile(abs, next);
    const status = await gitCommitAndPush(rel, "edit");
    return { content: [{ type: "text", text: `edited ${rel}${status}` }] };
  }
);

server.registerTool(
  "write_text",
  {
    title: "Write file",
    description: "Create or overwrite a file. Use for new project/action/area files from a template; prefer append/edit for existing files.",
    inputSchema: { path: z.string(), content: z.string() },
  },
  async ({ path: rel, content }) => {
    const abs = resolveInRoot(rel);
    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content);
    const status = await gitCommitAndPush(rel, "write");
    return { content: [{ type: "text", text: `wrote ${rel}${status}` }] };
  }
);

server.registerTool(
  "list",
  {
    title: "List directory",
    description: "List files and directories at a vault path.",
    inputSchema: { path: z.string().optional().describe("vault-relative dir, default root") },
  },
  async ({ path: rel }) => {
    const abs = resolveInRoot(rel || ".");
    const entries = await fs.readdir(abs, { withFileTypes: true });
    const out = entries
      .filter((e) => !SKIP_DIRS.has(e.name))
      .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
      .sort();
    return { content: [{ type: "text", text: out.join("\n") || "(empty)" }] };
  }
);

// ---- archive ---------------------------------------------------------------
server.registerTool(
  "archive_project",
  {
    title: "Archive project",
    description: "Move projects/<id>.md to archive/projects/<id>.md and set status: archived.",
    inputSchema: { id: z.string().describe("project id (filename without .md)") },
  },
  async ({ id }) => archiveItem("projects", id)
);

server.registerTool(
  "archive_action",
  {
    title: "Archive action",
    description: "Move actions/<id>.md to archive/actions/<id>.md and set stage: archived.",
    inputSchema: { id: z.string().describe("action id (filename without .md)") },
  },
  async ({ id }) => archiveItem("actions", id)
);

server.registerTool(
  "archive_area",
  {
    title: "Archive area",
    description: "Move areas/<id>.md to archive/area/<id>.md and set status: archived.",
    inputSchema: { id: z.string().describe("area id (filename without .md)") },
  },
  async ({ id }) => archiveItem("areas", id)
);

// ---- glossary --------------------------------------------------------------
server.registerTool(
  "glossary_add",
  {
    title: "Add glossary entry",
    description:
      "Insert a new row into glossary.md in the correct alphabetical position by acronym. " +
      "Server-side sort — do not read glossary.md first.",
    inputSchema: {
      acronym:    z.string().describe("The acronym or short form, e.g. 'ACE'"),
      definition: z.string().describe("Full expansion, e.g. 'AMBA Coherency Extensions'"),
      notes:      z.string().optional().describe("Optional context or disambiguation"),
    },
  },
  async ({ acronym, definition, notes = "" }) => {
    const rel = "glossary.md";
    const abs = resolveInRoot(rel);
    const text = await fs.readFile(abs, "utf8");
    const lines = text.split("\n");

    const isDataRow = (l) => /^\|/.test(l) && !/^\|[-: |]+\|/.test(l);
    const acronymOf  = (l) => l.split("|")[1]?.trim() ?? "";
    const newKey = acronym.toLowerCase();
    let insertAt = -1;
    for (let i = 0; i < lines.length; i++) {
      if (isDataRow(lines[i]) && acronymOf(lines[i]).toLowerCase() <= newKey) {
        insertAt = i + 1;
      }
    }
    if (insertAt === -1) {
      insertAt = lines.findIndex((l) => /^\|[-: |]+\|/.test(l)) + 1;
    }

    const newRow = `| ${acronym} | ${definition} | ${notes} |`;
    lines.splice(insertAt, 0, newRow);
    await fs.writeFile(abs, lines.join("\n"));
    const status = await gitCommitAndPush(rel, "glossary_add");
    return { content: [{ type: "text", text: `added '${acronym}' at line ${insertAt + 1}${status}` }] };
  }
);

// ---- blog drafts -----------------------------------------------------------
server.registerTool(
  "blog_draft",
  {
    title: "Create blog draft",
    description:
      "Create a new blog draft in drafts/blog-{slug}.md with correct frontmatter. " +
      "The 'blog' tag is always included; add domain-specific tags alongside it.",
    inputSchema: {
      slug:  z.string().describe("kebab-case identifier, e.g. 'mcp-oauth-setup'"),
      title: z.string().describe("Post title, used as the H1 heading"),
      tags:  z.array(z.string()).optional().describe("Extra tags beyond 'blog'"),
      body:  z.string().optional().describe("Initial markdown body content"),
    },
  },
  async ({ slug, title, tags = [], body = "" }) => {
    const today = new Date().toISOString().slice(0, 10);
    const allTags = ["blog", ...tags.filter((t) => t !== "blog")];
    const rel = `drafts/blog-${slug}.md`;
    const abs = resolveInRoot(rel);

    const content = [
      "---",
      `id: blog-${slug}`,
      `stage: draft`,
      `tags: [${allTags.join(", ")}]`,
      `created: ${today}`,
      "---",
      "",
      `# ${title}`,
      "",
      body,
    ].join("\n").trimEnd() + "\n";

    await fs.mkdir(path.dirname(abs), { recursive: true });
    await fs.writeFile(abs, content);
    const status = await gitCommitAndPush(rel, "blog_draft");
    return { content: [{ type: "text", text: `created ${rel}${status}` }] };
  }
);

// ---- delete ----------------------------------------------------------------
server.registerTool(
  "delete",
  {
    title: "Delete file",
    description:
      "Permanently delete a vault file. A small set of core files (glossary.md, CLAUDE.md, README.md, todo.md) are protected.",
    inputSchema: {
      path: z.string().describe("vault-relative path"),
    },
  },
  async ({ path: rel }) => {
    const PROTECTED = new Set(["glossary.md", "CLAUDE.md", "README.md", "todo.md"]);
    if (PROTECTED.has(path.basename(rel))) {
      return { content: [{ type: "text", text: `'${rel}' is a protected file and cannot be deleted` }], isError: true };
    }
    const abs = resolveInRoot(rel);
    try { await fs.access(abs); } catch {
      return { content: [{ type: "text", text: `'${rel}' not found` }], isError: true };
    }
    await fs.unlink(abs);
    try {
      await execFileAsync("git", ["-C", ROOT, "rm", "--cached", rel]);
      await execFileAsync("git", ["-C", ROOT, "commit", "-m", `mcp: delete ${rel}`]);
      await execFileAsync("git", ["-C", ROOT, "pull", "--rebase", "--autostash", "origin", "main"]);
      await execFileAsync("git", ["-C", ROOT, "push", "origin", "main"]);
      return { content: [{ type: "text", text: `deleted ${rel} — pushed` }] };
    } catch (err) {
      const msg = (err.stderr || err.message || String(err)).trim().split("\n")[0];
      return { content: [{ type: "text", text: `deleted ${rel} (git: ${msg})` }] };
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
```

</details>
