# Build toolchain

Companion to `CLAUDE.md`, which holds the site rules. This file records the
tools that render diagrams, and the reason their output is no longer tracked.

## Diagram renderers

The three diagram plugins shell out to external command line tools. Each one
writes an SVG into a hash-keyed cache under `content/images/`, and the hash
covers the diagram source only, never the renderer version.

| Fence | Plugin | Submodule pin | Renderer | Version here | Cache |
|---|---|---|---|---|---|
| ` ```fretboard ` | `pelican-fretboard` | `341faff7` | `fretdrom` (npm global, linked to a local checkout) | 0.4.0 | `content/images/fretboard/` |
| ` ```dot ` | `pelican-fsm` | `887f1683` | `dot` (Homebrew graphviz) | 16.1.0 (20260904.0139) | `content/images/fsm/` |
| ` ```mermaid ` | `pelican-fsm` | `887f1683` | `mmdc` (`@mermaid-js/mermaid-cli`) | 11.12.0 | `content/images/fsm/` |
| ` ```wavedrom ` | `pelican-wavedrom` | `12f317a3` | `wavedrom-cli` | 3.2.0 | `content/images/wavedrom/` |

Supporting versions on this machine: Python 3.13.15, Pelican 4.12.0, Node
v26.9.0.

Install the renderers with:

```bash
brew install graphviz
npm install -g @mermaid-js/mermaid-cli wavedrom-cli fretdrom
```

## The caches are not tracked

`content/images/fretboard/`, `content/images/fsm/` and `content/images/wavedrom/`
are in `.gitignore`. They were tracked until 2026-09-19.

Two builders with different renderer versions write different bytes into the
same cache filenames, so each build reverted the other and every pull collided.
Commit `a0d5edf3` showed the scale of it: one 41-line post arrived with 168
changed cache files, because that builder ran graphviz 2.42.4, an older
`fretdrom` that omits the root `viewBox`, and an older mermaid. Graphviz
versions also move node coordinates, so the diagrams themselves differed, not
only the serialisation.

## What this costs

A machine that builds the site without these renderers installed produces a
syntax-highlighted code block in place of each diagram, and nothing fails. The
caches no longer travel in the repository, so that failure is now silent and
publishable.

Before a deploy from a machine that has not deployed before, check all four
renderers answer:

```bash
dot -V
mmdc --version
wavedrom-cli --version
fretdrom
```

Then confirm the diagrams rendered, counting `src` paths rather than a class
name:

```bash
H=output/<slug>.html
echo "fretboard=$(grep -c 'images/fretboard/' $H) wavedrom=$(grep -c 'images/wavedrom/' $H) fsm=$(grep -c 'images/fsm/' $H)"
```

A zero where a diagram belongs means the renderer is missing or the plugin
failed. Do not deploy that build.
