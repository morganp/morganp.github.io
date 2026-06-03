Title: A Second MCP Server: Managing a Pelican Blog from Claude
Date: 2026-06-03
Category: Hardware & Homelab
Tags: MCP, Pelican, homelab, Node.js, nginx, Claude
Author: morganp
Status: published
Summary: How to add a second self-hosted MCP server alongside an existing one — a blog-management MCP that lets Claude create posts, add images, and publish a Pelican site without leaving the conversation.

Once you've set up one self-hosted MCP server, adding a second is mostly a case of reusing the infrastructure you've already built. This post covers adding a blog-management MCP to the same host as an existing MCP server — so the OAuth service, nginx, and firewall rules carry over, and the new server is a matter of writing the tools and adding a new location block to nginx.

The target: a `blog-mcp` server that lets Claude pull the repo, create and edit posts, add images, run `make github` to build and publish, and push the source — all without leaving the conversation.

---

## What's Already in Place

This guide assumes the first MCP server setup from the previous post is done:

- Node.js 22 and supergateway installed on the host
- nginx with OAuth bearer token validation (the `map {}` block and auth variable defined at the `http {}` level)
- The OAuth server handling the OAuth authorization code + PKCE flow
- Firewall rules blocking direct access to internal supergateway ports

If you're starting fresh, read that post first. The OAuth setup is the hard part; it isn't repeated here.

---

## The Blog Repo Structure

The blog is a [Pelican](https://getpelican.com) static site. Two branches:

- **`main`** — Pelican source: `content/`, `Makefile`, `pelicanconf.py`, `requirements.txt`
- **`gh-pages`** — built HTML output; GitHub Pages serves this branch

`make github` does three things: runs Pelican to build, runs `ghp-import` to stage the output onto `gh-pages`, then pushes that branch to GitHub.

When you clone a GitHub Pages repo, `git` defaults to the `gh-pages` branch (it's the GitHub default). The source is on `main`:

```bash
git clone git@github.com:yourname/yourname.github.io.git /opt/blog
cd /opt/blog
git checkout main
```

---

## Pelican Metadata Format

Pelican does not use YAML frontmatter. It uses a colon-separated block at the top of the file, ending at the first blank line:

```
Title: My Post Title
Date: 2026-06-03
Category: Programming
Tags: Python, MCP
Author: yourname
Status: published
Slug: my-post-title

Body text starts here.
```

`Status: draft` keeps the post out of the built output. `Status: published` includes it. The server defaults all new posts to `draft` — you have to explicitly flip it before running `make github`.

The metadata parser is straightforward:

```javascript
function parsePelicanMeta(text) {
  const lines = text.split("\n");
  const meta = {};
  for (const line of lines) {
    if (line.trim() === "") break;
    const m = line.match(/^([A-Za-z][A-Za-z0-9_-]*):\s*(.*)$/);
    if (m) meta[m[1]] = m[2].trim();
  }
  return meta;
}
```

---

## Adding the Second Server

The blog MCP runs on the same nginx port as the first MCP — no new public port needed. The difference is the URL path: the existing MCP server is reachable at `/mcp`, and the blog MCP is exposed at `/blog-mcp`. Internally, each path reverse-proxies to its own supergateway instance on a fixed localhost port.

```
https://your-mcp-host/mcp       → supergateway (first MCP)   [localhost:XXXX]
https://your-mcp-host/blog-mcp  → supergateway (blog MCP)    [localhost:YYYY]  ← new
```

The OAuth server, bearer token validation, and `/.well-known/` discovery endpoints are shared — they're defined once and apply to all location blocks on the same server.

---

## Setting Up the Pelican Environment

Debian Trixie blocks `pip install` at the system level (`externally-managed-environment`). Use a virtual environment:

```bash
apt install python3-pip python3-venv make
python3 -m venv /opt/blog-venv
/opt/blog-venv/bin/pip install -r /opt/blog/requirements.txt
```

The Makefile references `pelican` and `ghp-import` by bare name. Point it at the venv by adding two variables at the top:

```makefile
PELICAN?=/opt/blog-venv/bin/pelican
GHPIMPORT?=/opt/blog-venv/bin/ghp-import
```

And update the `github` target to use `$(GHPIMPORT)` instead of `ghp-import`.

Test manually before wiring anything into MCP:

```bash
cd /opt/blog && make github
```

GitHub will reject commits from a private email address. Use the GitHub noreply address (find yours at github.com/settings/emails):

```bash
git config --global user.email "12345+username@users.noreply.github.com"
```

---

## The MCP Server

`/opt/blog-mcp/server.js` — a Node.js ES module MCP server. The tools:

### `blog_pull`

```javascript
await execFileAsync("git", ["-C", BLOG_ROOT, "pull", "--rebase"], { timeout: 30000 });
```

Always call at the start of a session. Returns the git output.

### `blog_list_posts`

Walks `content/posts/` recursively (posts with images live in subdirectories), parses Pelican metadata from each `.md`/`.markdown` file, returns one summary line per post sorted by date descending.

Supports filtering by `status` (`published`, `draft`, `all`) and `category`.

**JS footgun to avoid:** In an async `for...of` loop, `return` exits the entire function — not just the current iteration. Use `continue` to skip. This caused `blog_list_posts` to return nothing on the first run because a post without a `Title` triggered an early `return` from the walk function.

```javascript
// Wrong:
if (!meta.Title) return;   // exits walk(), finds nothing

// Right:
if (!meta.Title) continue; // skips this file, keeps walking
```

### `blog_new_post`

```javascript
const filename = `${today}_${slug}.md`;
const abs = path.join(POSTS_DIR, filename);
```

Writes a correctly-formatted Pelican metadata block. Hard-codes the author name and `Status: draft`. The LLM supplies title, category, tags, and body.

### `blog_edit_post`

Find/replace in a post file, identified by slug, filename, or relative path. Used to flip status:

```
blog_edit_post(slug="my-post", old_string="Status: draft", new_string="Status: published")
```

### `blog_make`

Runs an allowlisted make target. The allowlist is `{ "html", "publish", "github" }`. `clean` is deliberately excluded — losing your output directory mid-session is annoying.

The key detail: pass the venv `bin/` to the make subprocess via `PATH`:

```javascript
await execFileAsync(MAKE, [target], {
  cwd: BLOG_ROOT,
  timeout: 120000,
  env: { ...process.env, PATH: `${VENV_BIN}:${process.env.PATH}` }
});
```

Without this, make can't find `pelican` or `ghp-import`.

`make github` takes 10–30 seconds depending on site size. Set `proxy_read_timeout 120s` in nginx — the default 60s is marginal.

### `blog_commit` and `blog_push`

```javascript
await execFileAsync("git", ["-C", BLOG_ROOT, "add", "-A"]);
await execFileAsync("git", ["-C", BLOG_ROOT, "commit", "-m", message]);
// ...
await execFileAsync("git", ["-C", BLOG_ROOT, "push", "origin", "main"]);
```

Separated intentionally — commit first, review `blog_status`, then push.

### `blog_add_image`

Node 22 has `fetch` built in. Saves to `content/images/{subdir}/{filename}` and returns the `{attach}` path for use in post markdown:

```javascript
const response = await fetch(url);
const buffer = await response.arrayBuffer();
await fs.writeFile(dest, Buffer.from(buffer));
```

---

## The Systemd Service

`/etc/systemd/system/blog-mcp.service`:

```ini
[Unit]
Description=Blog MCP Server
After=network.target

[Service]
Type=simple
ExecStartPre=/bin/bash -c 'cd /opt/blog-mcp && npm install --silent'
ExecStart=/usr/bin/supergateway --stdio 'node /opt/blog-mcp/server.js' \
  --port <internal-port> --outputTransport streamableHttp
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=BLOG_ROOT=/opt/blog
Environment=VENV_BIN=/opt/blog-venv/bin

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now blog-mcp
```

Block the internal supergateway port from external access:

```bash
nft add rule inet filter input iif != 'lo' tcp dport <internal-port> drop
nft list ruleset > /etc/nftables.conf
```

---

## The nginx Block

Rather than a new server block, the blog MCP gets a new `location` block inside the existing server. The `map {}` for bearer token validation was already defined at the `http {}` level, so the auth variable is available here automatically.

Add this location to the existing MCP server block:

```nginx
location /blog-mcp {
    if ($mcp_auth_ok = 0) {
        add_header WWW-Authenticate 'Bearer realm="blog-mcp", resource_metadata="http://$http_host/.well-known/oauth-protected-resource"' always;
        return 401 '{"error":"unauthorized"}';
    }
    proxy_pass http://127.0.0.1:<internal-port>;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_buffering off;
    proxy_read_timeout 120s;
    proxy_set_header Connection '';
    chunked_transfer_encoding on;
}
```

```bash
nginx -t && systemctl reload nginx
```

The `/.well-known/` discovery endpoints, `/authorize`, and `/token` locations are already present in the existing server block and serve both MCPs without any changes.

---

## A Session in Practice

```
blog_pull()
→ "Already up to date."

blog_new_post(slug="my-topic", title="My Topic", category="Programming", tags=["Python"])
→ "Created content/posts/2026-06-03_my-topic.md (Status: draft)"

blog_edit_post(slug="my-topic", old_string="Status: draft", new_string="Status: published")
→ "Edited content/posts/2026-06-03_my-topic.md"

blog_commit(message="add: my-topic post")
→ "[main abc1234] add: my-topic post"

blog_make(target="github")
→ "Done: Processed 432 articles... git push origin gh-pages"

blog_push()
→ "main -> main"
```

Seven tool calls, one published post.

---

## Why Not Just Use the Existing MCP?

The first MCP server already has `write_text` and `edit` tools. In theory you could manage a blog repo with those. In practice, it's the wrong tool — you'd be reading files to learn the Pelican metadata format, manually constructing filenames, running shell commands out of band, and hoping nothing breaks in the `make` step.

A purpose-built MCP server encodes the domain knowledge: where posts live, what the metadata block looks like, which `make` targets are safe to run, how to handle collateral like images and PDFs. The LLM just supplies the content.

Having built the first MCP server already, a few things carry over directly:

**Domain-specific tools beat generic ones.** `blog_new_post` is worth writing because it encodes the Pelican metadata format, the file naming convention, and the draft-by-default behaviour. The alternative — `write_text` with a format the LLM has to reconstruct every time — is slower and more fragile.

**Server-side computation is free tokens.** Alphabetical sorting, date stamping, filename construction — anything the server can do deterministically, it should. Don't ask the LLM to reason about things it doesn't need to.

**Keep the allowlist tight.** The `make` target allowlist exists for the same reason the brain-mcp protects `glossary.md` and `CLAUDE.md` from deletion: mistakes are much easier to prevent than to fix.

**`proxy_buffering off` is not optional.** Pelican builds can produce a lot of output. Without it, the nginx buffer fills, the connection stalls, and the tool times out without explanation.
Slug: second-mcp-pelican-blog
