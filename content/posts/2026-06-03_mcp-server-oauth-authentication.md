Title: Adding OAuth Authentication to a Self-Hosted MCP Server
Date: 2026-06-03
Category: Hardware & Homelab
Tags: MCP, OAuth, nginx, Node.js, homelab, security, Claude
Author: morganp
Status: published
Summary: How to add OAuth 2.1 authentication to a self-hosted MCP server using nginx as a reverse proxy and a minimal Node.js OAuth server — covering four failure modes and what actually works with Claude.ai.
Slug: mcp-server-oauth-authentication

If you're running a self-hosted MCP server and exposing it over HTTP, you need authentication. Without it, anyone who can reach your port can invoke your tools.

This is the story of how I added OAuth 2.1 auth to the vault MCP server from the previous post. It took longer than expected, involved four distinct failures, and produced a setup I'm happy with. Here's what I learned.

---

## The Starting Point

The server runs on a Debian container on Proxmox. The stack before this work:

- `server.js` — Node.js MCP server (stdio transport)
- `supergateway` — bridges stdio → Streamable HTTP on port 3001
- `vault-mcp.service` — systemd unit managing supergateway
- No authentication — port 3001 open, any client could read and write vault files

---

## Step 1: nginx as an Authenticating Reverse Proxy

supergateway has no built-in support for validating incoming authentication — `--oauth2Bearer` is outbound-only, adding headers to requests supergateway makes upstream, not checking headers on requests coming in.

The solution is to place nginx in front: move supergateway to an internal port, and let nginx handle bearer token validation before any request reaches the MCP server.

---

## Step 2: The Architecture

```
MCP client (Claude.ai)
      │  HTTP  Authorization: Bearer <token>
      ▼
 nginx :3001  (public)
      │  validates bearer token
      │  serves /.well-known/ OAuth discovery endpoints
      │  proxies /authorize and /token to OAuth server
      ▼
 OAuth server :3003  (localhost only)
      │  minimal OAuth 2.0 AS — auto-approves, issues static token
      ▼
 supergateway :3002  (localhost only, blocked by firewall)
      │
      ▼
 node server.js
```

---

## Step 3: Move supergateway, Install nginx, Block the Internal Port

```bash
# Move supergateway to an internal port
sed -i 's/--port 3001/--port 3002/' /etc/systemd/system/vault-mcp.service
systemctl daemon-reload && systemctl restart vault-mcp

# Install nginx
apt install -y nginx

# Block external access to the internal supergateway port
nft add rule inet filter input iif != 'lo' tcp dport 3002 drop
nft list ruleset > /etc/nftables.conf
systemctl enable nftables
```

---

## Step 4: The First nginx Config — Static Bearer Token

Initial plan: generate a strong bearer token, put it in nginx's `map {}` block, return 401 if it's missing or wrong.

```bash
openssl rand -base64 48
```

```nginx
map_hash_bucket_size 128;

map $http_authorization $mcp_auth_ok {
    default                      0;
    "Bearer <your-token-here>"   1;
}

server {
    listen 3001;

    location /mcp {
        if ($mcp_auth_ok = 0) {
            add_header WWW-Authenticate 'Bearer realm="mcp"' always;
            return 401 '{"error":"unauthorized"}';
        }
        proxy_pass http://127.0.0.1:3002;
        proxy_buffering off;
        proxy_set_header Connection '';
        proxy_read_timeout 300s;
    }
}
```

### Failure 1: map_hash_bucket_size

`nginx -t` immediately failed:

```
[emerg] could not build map_hash, you should increase map_hash_bucket_size: 64
```

nginx's `map {}` stores keys in a hash table. The default bucket size is 64 bytes. The full `Authorization` header value (`Bearer ` prefix + a 64-character token) is ~71 bytes. Fix: add `map_hash_bucket_size 128;` at the top of the file.

---

## Step 5: Claude.ai Doesn't Accept a Pre-Shared Bearer Token

The static bearer approach worked in curl. Then I tried to configure it in Claude.ai's remote MCP settings — and hit the second failure.

### Failure 2: Claude.ai Requires Real OAuth

The Claude.ai web interface doesn't ask "what's your bearer token?" It asks for **OAuth Client ID** and **OAuth Client Secret**.

Claude.ai implements the MCP auth spec's full [OAuth 2.1 authorization code + PKCE flow](https://spec.modelcontextprotocol.io/specification/2025-03-26/basic/authorization/). It needs:

1. A `/.well-known/oauth-authorization-server` discovery endpoint (RFC 8414)
2. An `/authorize` endpoint it can redirect the user's browser to
3. A `/token` endpoint where it exchanges the code for an access token

A static pre-shared bearer token isn't surfaced in the UI at all. You need to run an actual OAuth authorization server.

---

## Step 6: A Minimal OAuth Server in ~150 Lines of Node.js

For a single-user personal server, a "real" OAuth AS doesn't need to be complex. The key insight: **auto-approve all authorization requests** — there's only one trusted client — and **always issue the same static access token** so nginx validation stays simple and restarts don't force re-authentication.

```javascript
// oauth-server.js (abridged)
import http from "node:http";
import crypto from "node:crypto";

const { OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_ACCESS_TOKEN } = process.env;
const pendingCodes = new Map();

const server = http.createServer((req, res) => {
  // GET /authorize — auto-approve, redirect with code
  if (req.method === "GET" && pathname === "/authorize") {
    const { client_id, redirect_uri, state, code_challenge, code_challenge_method } = query;
    if (client_id !== OAUTH_CLIENT_ID) return json(res, 400, { error: "invalid_client" });

    const code = crypto.randomBytes(24).toString("base64url");
    pendingCodes.set(code, {
      redirectUri: redirect_uri,
      codeChallenge: code_challenge,
      method: code_challenge_method,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    const redirect = new URL(redirect_uri);
    redirect.searchParams.set("code", code);
    if (state) redirect.searchParams.set("state", state);
    res.writeHead(302, { Location: redirect.toString() });
    return res.end();
  }

  // POST /token — verify PKCE + client secret, return static token
  if (req.method === "POST" && pathname === "/token") {
    // ... validate client_id, client_secret, code, PKCE verifier ...
    return json(res, 200, {
      access_token: OAUTH_ACCESS_TOKEN,
      token_type: "Bearer",
      expires_in: 31536000,  // 1 year — effectively non-expiring
    });
  }
});

server.listen(3003, "127.0.0.1");
```

### Failure 3: crypto.timingSafeEqual Crashes on Mismatched Lengths

When testing with a wrong `client_secret`, the server crashed:

```
RangeError: Input buffers must have the same byte length
```

`crypto.timingSafeEqual` requires both buffers to be exactly the same byte length — it throws rather than returning `false`. Always guard it:

```javascript
const secretBuf   = Buffer.from(client_secret || "");
const expectedBuf = Buffer.from(OAUTH_CLIENT_SECRET);
const secretOk = secretBuf.length === expectedBuf.length &&
  crypto.timingSafeEqual(secretBuf, expectedBuf);
```

Without the guard, a wrong-length secret becomes a denial-of-service vector — the crash causes a 502 from nginx.

---

## Step 7: Wire nginx to the OAuth Server

Updated nginx config — the key additions are proxying `/authorize` and `/token`, and adding the OAuth discovery metadata:

```nginx
server {
    listen 3001;
    server_name _;

    location = /.well-known/oauth-protected-resource {
        default_type application/json;
        add_header Access-Control-Allow-Origin * always;
        return 200 '{"resource":"http://$http_host","authorization_servers":["http://$http_host"]}';
    }

    location = /.well-known/oauth-authorization-server {
        default_type application/json;
        add_header Access-Control-Allow-Origin * always;
        return 200 '{"issuer":"http://$http_host","authorization_endpoint":"http://$http_host/authorize","token_endpoint":"http://$http_host/token","response_types_supported":["code"],"grant_types_supported":["authorization_code"],"code_challenge_methods_supported":["S256","plain"],"token_endpoint_auth_methods_supported":["client_secret_post"]}';
    }

    location = /authorize {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location = /token {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }

    location /mcp {
        if ($mcp_auth_ok = 0) {
            add_header WWW-Authenticate 'Bearer realm="mcp", resource_metadata="http://$http_host/.well-known/oauth-protected-resource"' always;
            return 401 '{"error":"unauthorized"}';
        }
        proxy_pass http://127.0.0.1:3002;
        proxy_buffering off;
        proxy_read_timeout 300s;
        proxy_set_header Connection '';
        chunked_transfer_encoding on;
    }
}
```

---

## Step 8: The Token Exchange Never Happened

OAuth flow in Claude.ai: browser hits `/authorize` → gets a 302 with a code → follows it to Claude.ai's callback URL. Then Claude.ai's connector should call `POST /token` to exchange the code.

It never did. The nginx access log showed the browser hitting `/authorize` (302 ✓), then Claude.ai's connector immediately hitting `/mcp` again with 401 — no `/token` call in between.

### Failure 4: Hardcoded Private IP in OAuth Metadata

The `/.well-known/oauth-authorization-server` response contained:

```json
{
  "issuer": "http://192.168.x.x:3001",
  "token_endpoint": "http://192.168.x.x:3001/token"
}
```

Per RFC 8414, the `issuer` in OAuth metadata must match the URL used to discover it. A mismatch is a valid reason for a client to reject the metadata entirely. Even if the connector didn't strictly validate the issuer, a private LAN IP is unreachable from Claude.ai's infrastructure if the token exchange happens server-side.

**Fix:** Use nginx's `$http_host` variable in the metadata JSON so the URLs always reflect whatever hostname the request arrived on:

```nginx
return 200 '{"issuer":"http://$http_host","token_endpoint":"http://$http_host/token",...}';
```

After this change: ✅ Claude.ai completed the full OAuth flow and connected successfully.

---

## The OAuth Server systemd Service

`/etc/systemd/system/oauth-server.service`:

```ini
[Unit]
Description=MCP OAuth Server
After=network.target

[Service]
Type=simple
ExecStart=node /opt/mcp-oauth/oauth-server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=OAUTH_CLIENT_ID=your-client-id
Environment=OAUTH_CLIENT_SECRET=your-client-secret
Environment=OAUTH_ACCESS_TOKEN=your-static-bearer-token

[Install]
WantedBy=multi-user.target
```

The static `OAUTH_ACCESS_TOKEN` is the value in nginx's `map {}` block. Generate all three secrets with `openssl rand -base64 48` and treat them like passwords.

---

## Lessons

| # | Lesson |
|---|---|
| 1 | `supergateway --oauth2Bearer` is outbound-only — it does not validate incoming requests |
| 2 | Claude.ai's MCP UI requires OAuth Client ID + Secret — a pre-shared bearer header isn't an option |
| 3 | `map_hash_bucket_size 128` is needed for tokens longer than ~55 characters |
| 4 | `proxy_buffering off` is essential for MCP streaming — without it clients hang |
| 5 | `crypto.timingSafeEqual` throws on mismatched buffer lengths — always check lengths first |
| 6 | Never hardcode IPs in OAuth metadata — use `$http_host` so the issuer always matches the discovery URL |
| 7 | `nftables iif != "lo" tcp dport XXXX drop` is the cleanest way to lock an internal service to loopback |

---

## What I'd Do Differently

Skip the static-bearer-token phase and go straight to the OAuth server. The MCP auth spec is clear that OAuth 2.1 is the mechanism — "just use a header" is wishful thinking once you're integrating with a spec-compliant client like Claude.ai.

The minimal OAuth server approach (auto-approve + static token) is a good fit for a personal server. It's not a security shortcut — the actual secret is the client credentials, PKCE is enforced, and the issued token is what nginx validates. The "simplification" is just removing the login page that makes no sense for a single trusted client.

The next post covers adding a second MCP server to the same host — reusing all of this OAuth infrastructure for a blog-management server on a different URL path.
