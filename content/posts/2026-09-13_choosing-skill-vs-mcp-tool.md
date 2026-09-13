Title: Skill or MCP tool? A rule of thumb for Claude integrations
Date: 2026-09-13
Category: Programming
Tags: claude, mcp, skills, architecture, secondbrain
Author: morganp
Status: published
Summary: A practical rule for deciding whether a new Claude capability should be a skill (prompted procedure) or an MCP tool (deterministic lookup/action), worked out while adding a "daily knot" feature to a SecondBrain morning briefing.
Slug: choosing-skill-vs-mcp-tool

## The question

While extending my SecondBrain `/morning` briefing, I wanted to add a couple of small daily extras: a "Daily Stoic" quote, and a "daily knot" tip. Both are just: look up today's entry from a fixed, pre-compiled dataset. The question was whether these belonged in the skillbook (as `SKILL.md` procedures) or as tools on the SecondBrain MCP server.

It turned out I'd already answered this once without noticing — `get_daily_stoic` already exists as an MCP tool, not a skill. That accident turned out to be the right call, and thinking through *why* gave a rule of thumb worth writing down.

## The distinction: lookup vs. reasoning

The deciding factor isn't whether the feature calls an external API. It's whether the work being done is **lookup** or **reasoning**.

- **MCP tool** — a fixed dataset (say, a JSON or markdown table keyed by date) behind a thin function that does a deterministic lookup. No model judgment is involved in producing the content itself; the same input always returns the same output.
- **Skill** — a procedure the model follows using judgment: formatting rules, what to prioritize, how to phrase things, what to omit. My existing `daily-summary` skill is a good example — it reasons over goals, actions, and due dates fresh each time, and that reasoning *is* the value it adds.

A "daily knot" or "daily quote" is a lookup, not a procedure. Building it as a skill would mean stuffing a reference file into context every time the briefing runs and asking the model to "pick today's entry" — non-deterministic, token-heavy, and re-deriving the same answer every session for no benefit.

## The practical shape this takes

1. **Curate the data once.** For something like knots, that's a one-time content pass — pull entries from reference books into a small structured file (`knots.json` or similar), living wherever the Stoic dataset already lives on the MCP server. This is content curation, not a recurring skill invocation.
2. **Add a matching tool.** A `get_daily_knot` tool mirroring `get_daily_stoic`'s signature — optional date param in, name/use-case/steps/source out.
3. **Let the skill stay thin.** The `/morning` skill just calls both tools and renders the results under a small section, alongside calendar, actions, and reminders. The skill layer keeps doing what it's good at (formatting, prioritization); the MCP layer keeps doing what it's good at (deterministic data serving).

## Why this matters beyond one feature

Keeping lookups out of skills has a few compounding benefits:

- **Determinism.** A tool call returns the same thing for the same date, every time, regardless of which client or model is asking.
- **Reusability.** An MCP tool is available to *any* MCP client, not just a Claude session with the skillbook loaded.
- **Cheaper composition.** No need to re-read a big reference file into context on every invocation — the skill only pays for the small rendered result.

The one design question this doesn't answer on its own: should a lookup like this rotate by calendar date (fixed 365-entry cycle, like the Stoic quote) or independently (random-but-non-repeating, needing far fewer entries plus a rotation pointer)? That's a smaller decision, but worth making explicitly before building the dataset — it changes how much content curation is actually required up front.

**Rule of thumb:** if adding the feature means writing a `SKILL.md` that just tells the model "here's a list, pick today's one" — it's not a skill. Put the list behind a tool, and let the skill call the tool.
