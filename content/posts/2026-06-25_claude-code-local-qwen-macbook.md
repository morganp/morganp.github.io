Title: Running Claude Code with a Local Qwen Model on a 16 GB MacBook
Date: 2026-06-25
Category: Programming
Tags: claude-code, llm, local-llm, qwen, llama-cpp, macos
Author: morganp
Status: draft
Summary: How to point Claude Code at a local llama-server on a 16 GB Apple Silicon MacBook. Covers model choice (Qwen3-8B fits well at 7 GB), server flags, settings profile, shell alias, prompt caching, and a failed MLX detour.
Slug: claude-code-local-qwen-macbook

Claude Code normally talks to Anthropic's API. With a small config change you can point it at a local [llama.cpp](https://github.com/ggml-org/llama.cpp) server instead, keeping everything on-device. This post covers the full setup on a 16 GB Apple Silicon MacBook.

## Why bother?

- No API cost for quick throwaway tasks
- No data leaving the machine
- Useful for offline work or testing prompts cheaply

The tradeoff: a local 7B model is noticeably weaker than Claude Sonnet. Use it for mechanical tasks (small edits, grep, file reads) and fall back to the real API for anything requiring reasoning.

## Model choice

The obvious pick is a large model, but on 16 GB RAM you need to be realistic.

**Too heavy:** `unsloth/Qwen3.5-35B-A3B-GGUF:Q4_K_M` -- with `-ngl 999` Metal hit GPU out-of-memory. Without full offload it ran at ~0.15 generation tok/s. Unusable for an interactive coding session.

**Works well:** `Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M` -- fits comfortably, fast enough once the prompt size is controlled (more on that below). Idle RSS ~4.4 GB.

**Better:** `Qwen/Qwen3-8B-GGUF:Q4_K_M` -- the newer Qwen3 generation, ~7 GB RSS, fits fine on 16 GB. More capable than the 7B coder model. This is what I'd recommend now.

## Install llama.cpp

```bash
brew install llama.cpp
llama-server --version
```

Tested against version `9780 (1191758c5)`.

## Start the server

```bash
llama-server \
  -hf Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M \
  --port 8131 \
  -ngl all \
  -t 8 \
  -c 32768 \
  -b 1024 \
  -ub 512 \
  --parallel 1 \
  -fa on \
  --jinja \
  --keep 1024 \
  --cache-type-k q8_0 \
  --cache-type-v q8_0 \
  --no-context-shift \
  --reasoning off
```

A few flag notes:

- `-ngl all` offloads all layers to Metal GPU. Required for usable speed.
- `--reasoning off` disables Qwen3 thinking mode. Without it the server logs show `thinking = 1` even when you try to disable it via template kwargs.
- `--jinja` enables the Jinja chat template, needed for correct instruction formatting.
- `--no-context-shift` prevents silent context truncation.

Verify it started:

```bash
curl http://127.0.0.1:8131/health
# {"status":"ok"}
```

Quick smoke test:

```bash
curl http://127.0.0.1:8131/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -d '{"model":"Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M","messages":[{"role":"user","content":"Reply with OK only."}],"max_tokens":8}'
```

Direct generation speed: ~102 prompt tok/s, ~67 generation tok/s.

## Claude Code settings profile

Create `~/.claude/settings-qwen.json`:

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "env": {
    "ANTHROPIC_BASE_URL": "http://127.0.0.1:8131",
    "ANTHROPIC_AUTH_TOKEN": "local",
    "ANTHROPIC_MODEL": "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M",
    "CLAUDE_CODE_SUBAGENT_MODEL": "Qwen/Qwen2.5-Coder-7B-Instruct-GGUF:Q4_K_M",
    "CLAUDE_CODE_MAX_OUTPUT_TOKENS": "8192",
    "DISABLE_AUTOUPDATER": "1",
    "DISABLE_TELEMETRY": "1",
    "DISABLE_ERROR_REPORTING": "1",
    "DISABLE_NON_ESSENTIAL_MODEL_CALLS": "1"
  }
}
```

`ANTHROPIC_AUTH_TOKEN=local` is a dummy value -- the local server does not check it.

Note: do **not** set `DISABLE_PROMPT_CACHING=1`. See the prompt caching section below.

## The critical flag: `--bare`

This is the single most important thing for making a local 7B model viable with Claude Code.

Regular Claude Code sends a large hidden system prompt plus tool schemas on every request. Measured token counts for a trivial `"test"` prompt:

| Launch mode | Prompt tokens | Wall time |
|---|---|---|
| Regular Claude Code | 23,808 | ~2 min |
| Regular, tools disabled | 5,746 | 18.7s |
| `--bare` + `Read,Edit,Write,Bash` | ~1,099 | sub-second (cache hit) |
| `--bare` + no tools | 154 | sub-second |

`--bare` strips hooks, LSP, plugin sync, auto-memory, CLAUDE.md discovery, and the large coding-agent system prompt. The model only sees your message and a minimal tool schema.

## Shell alias

```bash
alias claude-qwen='claude \
  --setting-sources local,project \
  --settings ~/.claude/settings-qwen.json \
  --bare \
  --tools "Read,Edit,Write,Bash"'
```

`--setting-sources local,project` skips the global `~/.claude/settings.json`, so your normal Claude settings are unaffected.

## Prompt caching: leave it on

You might expect to disable Anthropic-style prompt caching since the local server does not support it. Don't.

| Condition | First request | Second request |
|---|---|---|
| `DISABLE_PROMPT_CACHING=1` | 7.4s | 1.0s |
| Caching enabled (default) | 1.2s | 1.0s |

With caching disabled, the first request hits a slow path -- likely a retry after the server rejects the cache headers. With it enabled, llama.cpp's own KV cache handles reuse and the first request is already fast.

## Memory usage

The 7B Q4_K_M model uses ~4.4 GB RSS at idle. Under concurrent requests it stays flat at ~4.5 GB -- weights and KV cache are both pre-allocated at startup.

### Context size vs memory

Qwen2.5-Coder-7B has 8 KV heads, 28 layers, head_dim 128. With q8_0 cache:

```
KV cache = 2 × 28 × 8 × 128 × n_ctx × 1 byte = 57,344 bytes/token
```

| `-c` | KV cache | Total RSS |
|---|---|---|
| 32768 | ~1.75 GB | ~4.4 GB |
| 65536 | ~3.5 GB | ~6.2 GB |

32768 is plenty for `--bare` sessions -- typical usage stays well under 10k tokens. Only increase if you're loading large files or long sessions.

## What about MLX?

Apple Silicon supports MLX, a native ML framework that can run models without llama.cpp. I tried `mlx-community/Qwen3-8B-4bit` via `mlx_lm.server`. It didn't work out for two reasons:

1. **API format mismatch.** `mlx_lm.server` only speaks OpenAI format (`/v1/chat/completions`). Claude Code uses the Anthropic Messages API (`/v1/messages`). A translation proxy is needed. I wrote one, but Claude Code also sends streaming requests which the proxy didn't handle.

2. **LiteLLM (the standard proxy solution) fails on Python 3.14.** Homebrew ships Python 3.14 and LiteLLM's proxy dependencies (`orjson`, `backoff`, `apscheduler`, etc.) don't all have wheels for it yet.

GGUF via llama-server avoids all of this -- llama-server has built-in Anthropic Messages API compatibility, so Claude Code talks to it directly with no proxy.

## Summary

1. `brew install llama.cpp`
2. Start `llama-server -hf Qwen/Qwen3-8B-GGUF:Q4_K_M` with `-ngl all --reasoning off --jinja`
3. Create `~/.claude/settings-qwen3.json` pointing at the server
4. Use `claude --bare --tools "Read,Edit,Write,Bash" --settings ~/.claude/settings-qwen3.json`
5. Leave prompt caching enabled
6. Only run one server at a time -- each takes 4-7 GB RAM
