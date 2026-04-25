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
- After creating a new draft post, suggest the user preview it with `make devserver` and visit `http://localhost:8000/drafts/<slug>.html`.
- When moving an article from draft to published, ask the user if the Date metadata should be updated to today's date before publishing.
- do not use tabs in post, spaces only.

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

Categories: Engineering, Home & Garden, Hardware & Homelab, Music, Photography, Programming, Unix & Tools


## Image References in Posts

```markdown
![description]({attach}/images/SubFolder/photo.jpg)
```

Images go in `content/images/` and are configured as a static path.

## Deployment Flow

`make github` runs: `pelican content -s publishconf.py` → `ghp-import output -b gh-pages` → `git push origin gh-pages`

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
grep -c "fretboard-diagram" output/drafts/<slug>.html
```

A count of 0 means the plugin preprocessor did not run or all renders failed. Check for Python tracebacks in the build output -- silent failures write a warning to the log and fall through to Pygments, which displays the raw block as a syntax-highlighted code block instead of an image.
