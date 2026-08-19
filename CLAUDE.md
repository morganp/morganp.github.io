# Pelican Site Configuration and Rules

Pelican static site generator blog, hosted on GitHub Pages at lizard-spock.co.uk. Source lives on `main` branch; built HTML is deployed to `gh-pages` branch.

## Core Structure
- `content/`: Contains all Markdown/reStructuredText articles and pages.
- `content/pages/`: Static pages (About, Contact, etc.).
- `themes/`: Custom Pelican themes.
- `output/`: Generated HTML (do not manually edit this).
- `pelicanconf.py`: Local development configuration.
- `publishconf.py`: Production/Publishing configuration.

## Commands
- before python, make commands run `source ./venv/bin/activate`
- do not use em-dash in posts.
- do not use cleft sentences: write `the gate oxide blocks the current`, not `the gate oxide is what blocks the current`. Keep one only to correct a misconception, answer the previous sentence, or give a definition.
- check every mid-sentence `what`. It is usually a cleft to unwind, or a noun that was never named. `what the numbers mean` after a verb of knowing is fine.
- keep technical terms whole. Never let a modifier stand alone as a noun with its head elided: write `opposite branching`, not `the opposite ones`; `trees with alternate branching`, not `the tree is alternate`. Hyphenate when it modifies a noun: `an opposite-branching tree`.
- no commentary about the article itself: no `it is worth noting`, `worth seeing once`, `keep hold of`, `as mentioned above`.
- no commentary about the artwork either. Never narrate how a figure was made or claim it was made correctly (`coloured accurately`, `drawn to scale`). Say only what helps the reader use it. This is working notes leaking into the draft.
- After creating a new draft post, suggest the user preview it with `make devserver` and visit `http://localhost:8000/drafts/<slug>.html`.
- When moving an article from draft to published, ask the user if the Date metadata should be updated to today's date before publishing.
- do not use tabs in post, spaces only.

## Writing a Post

**Invoke the `blog-post` skill** (`.claude/skills/blog-post/`) before writing any
post or generating any image for this blog. Not "keep it in mind": call it with
the Skill tool, first, every time. It covers narrative structure, prose passes,
image generation, build verification and deploy.

It carries two blocking gates that have been skipped before:

1. **Outline gate.** Present the heading outline and stop. No body prose until
   the user approves. This lives in `technical-writer` Pass 1, so invoke that
   skill rather than working from memory of its four passes.
2. **Prototype gate.** Generate every image at `--size 512px` first, show it,
   and stop. No full-size render until the user approves the look. For a set of
   images, prototype one per visual family before committing to the set.
   Showing means running `open <path>` so it appears on screen. Reading the
   image into your own context is not showing it, describing it is not showing
   it, and neither is quoting a path for the user to open themselves.

House style facts, needed when editing existing posts too:

- **British spelling** (`optimised`, `signalling`, `centre`).
- **Manager / subordinate**, not master / slave, for bus roles. Current AMBA terminology; note on first use that older documents use the old terms.
- **Acronyms**: one post equals one chapter. Define once, on first use, not at every heading.
- **Diagram fences**: ` ```wavedrom `, ` ```dot `, ` ```mermaid `, ` ```fretboard `. Prefer these over generated images whenever the content has exact labels or counts.
- **Image generation** uses the `art` skill's `~/.claude/skills/art/tools/generate-image.ts`, authenticated by `GOOGLE_API_KEY` in `~/.claude/.env`. There is no browser login; do not use `genimg-gemini-web`. Always read a generated image back and check it before accepting it.
- **Long posts with images** live in a folder: `content/posts/YYYY-MM-DD_Title/YYYY-MM-DD_Title.md`.

### Creating New Posts

```bash
python create_new_post.py   # interactive CLI: pick category, enter title
```

This creates a draft post in `content/posts/` with filename `YYYY-MM-DD_Title.md`. Change `Status: draft` to `Status: published` to publish.

### Build & Serve Commands

```bash
source venv/bin/activate    # activate Python 3.13 venv first

make devserver              # build + serve with auto-regenerate at localhost:8000
make html                   # one-off build
make publish                # production build (uses publishconf.py)
make github                 # build production + deploy to gh-pages branch
make clean                  # remove output/
```
Run `make` with no args to see all targets.

> **Deploy time:** `make github` takes **35 to 40 minutes**, not 12. Always run in
> background and tell the user the real figure before starting. The breakdown as
> of 2026-08-19, ~453 articles:
> - Pelican build: ~15 min
> - `copy-webapps` rsync: ~20 min, almost all of it `stem-academy`, which is 270
>   files and 57 MB of 4-5 MB mascot PNGs read off iCloud Drive
> - `ghp-import` plus push: a few minutes
>
> **Never leave a devserver running during a deploy.** `make devserver` writes to
> the same `output/` that `make github` builds into, and `publishconf.py` sets
> `DELETE_OUTPUT_DIRECTORY=True`. Dev config uses `RELATIVE_URLS=True`, so
> devserver pages leaking into the push would break every link on the live site.
> Check with `pgrep -fl "pelican -lr"` first.


## Rules for Claude
1. **Commits**: Do not add a `Co-Authored-By` trailer or any Claude signature to commit messages.
2. **Content Creation**: When creating new posts, always use Markdown (`.md`) format.
2. **Metadata**: Ensure all content files contain the necessary Pelican metadata header (Title, Date, Category, Tags, Slug).
3. **Drafts**: Always create new posts with `Status: draft` in metadata. Never publish on creation unless explicitly asked.
4. **Links**: Use `|filename|` for internal linking to ensure correct paths.
5. **Images**: Store images in `content/images/` and reference them correctly.
   - Display images must be no wider than 900px and optimised for fast loading.
   - For generated images: produce a full-res version (suffix `-HQ.png`) and a 900px display version (suffix `-900w.png`) using `sips -Z 900 HQ.png --out 900w.png`.
   - When embedding in posts, display the 900px version. If a high-res version exists, link to it so clicking opens the full resolution: `[![alt]({attach}/images/Sub/img-900w.png)]({attach}/images/Sub/img-HQ.png)`
   - If no HQ version, use a plain image embed: `![alt]({attach}/images/Sub/img-900w.png)`
6. **Themes**: Do not modify files inside `themes/` unless explicitly told to.
7. **Configuration**: When updating settings, prefer modifying `pelicanconf.py` over `publishconf.py`.
8. **Art / Image Generation**: Always apply the lizard-spock site aesthetic when using the `/art` skill or generating any image for this blog. The style guide is at `~/.claude/skills/art/aesthetics/lizard-spock.md` — read it before constructing any image prompt.

## Architecture

- **content/posts/** — Blog posts (~410 markdown files, `.md` and legacy `.markdown`)
- **content/pages/** — Static pages (about.md, CNAME)
- **content/images/** — Image assets organized by category subfolder
- **content/pdf/** — pdf assets
- **pelicanconf.py** — Development config (RELATIVE_URLS=True)
- **publishconf.py** — Production config (absolute URLs, Atom feeds, DELETE_OUTPUT_DIRECTORY=True)
- **output/** — Generated site (gitignored, deployed via ghp-import to gh-pages)

Theme is Pelican's built-in "simple" theme with Jinja2 templates. Template pages for tag/index.html and category/index.html are configured in pelicanconf.py.

## Post Metadata Template
```markdown
Title: [Title]
Date: 2025-02-19
Category: [Category]
Tags: [Tag1, Tag2]
Slug: [slug-name]
Author: [Your Name]
Summary: [Short summary]
Status: published

Body goes here.

Categories: Engineering, Home & Garden, Hardware & Homelab, Music, Photography, Programming, Unix & Tools, Outdoor


## Image References in Posts

```markdown
![description]({attach}/images/SubFolder/photo.jpg)
```

Images go in `content/images/` and are configured as a static path.

## Deployment Flow

`make github` runs: `pelican content -s publishconf.py` → `ghp-import output -b gh-pages` → `git push origin gh-pages`

## Web Apps (Tools Dropdown)

Web apps appear in the Tools dropdown nav, configured in `pelicanconf.py` as `WEBAPPS`. Each app is a git submodule under `content/`.

**Serving convention:** Submodule repos with a `public/` subfolder are served via `make copy-webapps`, which rsyncs only `public/` into `output/<name>/`. This keeps `CLAUDE.md`, `HANDOFF.md`, and other repo metadata off the public site. Submodules without `public/` (Wavedrom Editor, Drum Rudiments) are listed in `STATIC_PATHS` and copied by Pelican directly.

| App | Submodule | Source repo | Branch/ref | Served via |
|-----|-----------|-------------|------------|------------|
| AMBA Explorer | `content/amba-explorer` | `github.com/morganp/amba-explorer` | `main` | `copy-webapps` (has `public/`) |
| OpenSCAD GUI | `content/openscad-gui` | `github.com/morganp/OpenSCAD-GUI` | `main` | `copy-webapps` (has `public/`) |
| Fretdrom Editor | `content/fretdrom-editor` | `github.com/morganp/fretdrom-editor` | `main` | `copy-webapps` (has `public/`) |
| Wavedrom Editor | `content/wavedrom-editor` | `github.com/morganp/wavedrom-editor` | `dist` (CI-built standalone) | `STATIC_PATHS` |
| Drum Rudiments | `content/drum_rudiments` | — | static files, no upstream repo yet | `STATIC_PATHS` |
| LPI Network Explorer | `content/amba-lpi-network-explorer` | `github.com/morganp/amba-lpi-network-explorer` | `main` | `copy-webapps` (single file, see below) |
| APB Network Explorer | `content/amba-apb-network-explorer` | `github.com/morganp/amba-apb-network-explorer` | `main` | `copy-webapps` (single file, see below) |

**Single-page externals folded into AMBA Explorer.** `amba-lpi-network-explorer` and
`amba-apb-network-explorer` each ship one self-contained `public/index.html`. They are
not separate Tools entries and do not get their own output folder. `copy-webapps`
rsyncs each file into the AMBA Explorer output as `LPI-Network-Explorer.html` and
`APB-Network-Explorer.html`. Those two lines must stay **after** the
`rsync -a --delete .../amba-explorer/public/` line, because that rsync deletes
anything in `output/amba-explorer/` not present in the AMBA Explorer submodule.
They are reachable by direct URL only; the AMBA Explorer landing page does not link
them.

### Updating a webapp submodule

```bash
cd content/<app-name>
git pull origin <branch>   # e.g. main or dist
cd ../..
git add content/<app-name>
git commit -m "Update <app-name> submodule"
```

### Adding a new webapp

**If submodule has a `public/` folder** (preferred -- keeps repo metadata off the web):

1. Add submodule: `git submodule add <repo-url> content/<name>`
2. Add rsync line to `copy-webapps` target in `Makefile`
3. Add `('<Title>', '/<name>/')` to `WEBAPPS` in `pelicanconf.py`
4. Commit `.gitmodules`, `content/<name>`, `Makefile`, and `pelicanconf.py`

**If submodule is a flat ready-to-serve directory** (no `public/` subfolder):

1. Add submodule: `git submodule add <repo-url> content/<name>`
2. Add `'<name>'` to `STATIC_PATHS` in `pelicanconf.py`
3. Add `('<Title>', '/<name>/')` to `WEBAPPS` in `pelicanconf.py`
4. Commit `.gitmodules`, `content/<name>`, and `pelicanconf.py`

### Cloning the repo (submodule init)

```bash
git clone --recurse-submodules <repo>
# or after a plain clone:
git submodule update --init --recursive
```

### CI note (Wavedrom Editor)

`morganp/wavedrom-editor` needs a build step. The GitHub Actions workflow
`.github/workflows/deploy-dist.yml` builds `dist/standalone/` and force-pushes
it to the `dist` branch on every push to `main` or version tag. The blog
submodule tracks the `dist` branch.

## Utility Scripts

- **python_search_and_replace.py** — Batch convert legacy `.markdown` metadata format
- **python_search_category.py** — Filter/search posts by category

## Plugin Development and Stale Cache

### The devserver rebuild loop

The devserver watches `content/` for changes. Plugins that write generated files into `content/images/` (fretboard SVGs, wavedrom SVGs, FSM SVGs) trigger a rebuild the moment those files are written, which then writes the same files again, causing another rebuild. This loop runs indefinitely but is harmless -- it stabilises once the files stop changing. It does mean the devserver is a poor tool for iterating on plugin code.

**When developing or debugging a plugin, use `make html` for all test builds instead of `make devserver`.**

### Stale HTML after plugin code changes

Pelican caches processed article content. If plugin code changes but the post source has not changed, Pelican may reuse the cached rendered HTML from a previous build, meaning new plugin behaviour is not reflected in the output even after a successful `make html`.

Two things must be cleared when plugin rendering logic changes:

1. **Plugin SVG cache** -- the hash-keyed files in `content/images/fretboard/` (and equivalents for wavedrom/fsm). If the SVG already exists on disk the plugin skips regeneration entirely.
2. **Pelican's reader cache** -- stored in `output/` (or `.cache/` if configured). `make clean` removes `output/` and forces a full rebuild.

**Full reset command after plugin changes:**

```bash
source venv/bin/activate
rm -f content/images/fretboard/*.svg   # clear fretboard SVG cache
make clean                             # remove output/
make html                              # full rebuild
```

After confirming the build looks correct, restart the devserver:

```bash
make devserver
```

### Verifying plugin output

To check how many diagrams rendered in a draft post without opening a browser:

```bash
grep -c "images/fretboard/" output/drafts/<slug>.html
grep -c "images/wavedrom/" output/drafts/<slug>.html
grep -c "images/fsm/"      output/drafts/<slug>.html
```

Match on the `src` path, not on a class name. The plugins emit no diagram-specific CSS class -- the markup is `<img alt="fretboard diagram" src="./images/fretboard/fretboard_<hash>.svg">` and the equivalents `alt="WaveDrom timing diagram"` and `alt="FSM diagram"`. Matching a slug-like string such as `fretboard-diagram` is doubly wrong: it never matches the markup, and it returns a false non-zero on any post whose own slug contains it.

A count of 0 means the plugin preprocessor did not run or all renders failed. Check for Python tracebacks in the build output -- silent failures write a warning to the log and fall through to Pygments, which displays the raw block as a syntax-highlighted code block instead of an image.
