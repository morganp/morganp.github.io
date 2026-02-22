Title: Verilog Lint Skill for Claude Code
Date: 2026-02-22 12:00
Category: Engineering
Tags: verilog, systemverilog, rtl, claude, ai, hardware, linting
Author: morganp
Status: published

I've been using Claude Code for RTL generation lately, and the missing piece was a tight feedback loop between code generation and linting. Writing Verilog by hand is tedious; having Claude generate it and immediately validate it with real tools closes that gap nicely.

## What it does

The skill connects two open-source linters into an agentic write → lint → fix → re-lint loop:

- **Verilator** (`--lint-only -Wall`) catches semantic errors: undeclared signals, bit-width mismatches, blocking assignments in `always_ff` blocks, multi-driven nets
- **Verible** (`verible-verilog-lint`) enforces style: naming conventions, whitespace, port alignment, `always_ff`/`always_comb` discipline

When Claude generates RTL, the skill automatically:

1. Writes the code to a temp file
2. Runs both linters
3. Parses error messages with line numbers
4. Applies fixes and re-lints — up to 3 times
5. Reports clean status or surfaces a diagnostic table if errors remain

## Why two tools

They complement each other. Verilator thinks like a synthesizer — it catches things that will fail elaboration or produce incorrect silicon. Verible doesn't simulate; it reads the source and checks against Google's SystemVerilog style guide. Together they cover both "will this work" and "is this readable".

## Both are free and open source

- Verilator: `brew install verilator` / `apt install verilator`
- Verible: `brew tap chipsalliance/verible && brew install verible` (macOS), or grab a binary from the [GitHub releases page](https://github.com/chipsalliance/verible/releases)

## RTL patterns baked in

The skill includes reference patterns for mistake-free SystemVerilog: synchronous-reset flip-flops, `always_comb` combinational blocks, parameterized FSMs with `typedef enum`. Claude defaults to these when generating new modules, which avoids most of the common lint warnings before the first pass even runs.

## Same pattern as WaveDrom

This follows the same skill format as the [WaveDrom timing diagram skill]({filename}2026-02-20_WaveDrom_Test.md) — a `SKILL.md` file that gives Claude structured instructions, reference tables, and workflow steps. Both skills live in `~/.claude/skills/` and are picked up automatically by Claude Code.

The combination is handy for hardware work: describe a protocol, get a timing diagram, then generate and lint the RTL that implements it.
