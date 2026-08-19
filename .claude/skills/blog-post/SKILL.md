---
name: blog-post
description: MANDATORY pipeline for any writing or image work on the lizard-spock.co.uk blog. Covers narrative structure, the technical-writer passes, image generation in the site aesthetic, build verification, and deploy. Use whenever the user asks for a new post, a draft, an article, a write-up, a how-to or a tutorial for this blog; converting a draft to published; editing, restructuring or rewriting an existing post; adding, replacing or regenerating any image, diagram or hero for a post; or says "write a post", "new post", "we have posts to write", "add images to", "redo the images". Load this before writing a single line of a post or generating a single image.
---

# Blog post pipeline (lizard-spock.co.uk)

Composes two skillbook skills rather than restating them:

- `technical-writer` owns prose craft: the four passes, the style guide, word replacements.
- `art` owns image generation. Read `~/.claude/skills/art/aesthetics/lizard-spock.md` before writing any prompt.

This skill owns what is specific to this repository: narrative shape, Pelican
conventions, the image pipeline, build verification, and deploy.

---

## Two gates that stop work and wait

Both of these have been skipped before. They are blocking. Do not treat them as
advisory, and do not batch past them because the task looks small or obvious.

| Gate | Where | What it means |
|---|---|---|
| **Outline** | end of Stage 2, Pass 1 | Present the heading outline and stop. No body prose until the user approves it. |
| **Prototype** | Stage 4, before any full-size render | Generate at `--size 512px`, **put it in front of the user's eyes**, and stop. No 2K render until they approve the look. Reading the image yourself is not showing it. |

When several posts or several images are in flight, the gate applies to the
batch: present every outline together, and prototype one representative image
per visual family, before committing to any of them.

---

## Stage 1: Structure the narrative

Do this before the `technical-writer` outline pass. It decides what the outline
is for.

Follow the four-part formula that makes Hannah Fry's explainers work. The
structure carries the piece, not the subject matter.

**1. Open with something the reader has experienced, not with the concept.**
Something physical, something they can picture. Never open with "This article
explains X". Then create a gap: the thing they have seen, without the reason
for it.

> Concept-first (avoid): "This article explains how AXI4 achieves high throughput."
>
> Experience-first (prefer): "The waveform has not moved for four thousand cycles. Nothing has crashed, no error is reported, and every signal looks legal."

**2. Spend most of the post on the mechanism.**
Cause and effect, one link at a time, in an order where each link only needs
what came before it. The reader should feel like they are working it out
alongside you rather than being told the answer.

**3. Build to the click.**
The thing the reader assumed was happening is not what is happening. State the
reframe plainly at the moment it lands. Every post should have one sentence
that reorganises everything before it.

**4. End smaller than you started.**
A practical tip, a small observation, a checklist. No sweeping takeaway, no
inspirational closer. The post has already done its work.

The goal is not to make a complicated thing simple. It is to make the reader
curious enough to want the explanation.

### Reconciling the hook with the style guide

The `technical-writer` style guide asks the opening to state purpose and
audience within the first three sentences. That does not conflict with the
hook, and the order matters:

1. Two or three sentences of concrete, physical experience, ending in a gap.
2. Then the purpose and audience sentence.

The hook earns the reader's attention; the purpose sentence tells them whether
to keep going. Both belong in the first block.

---

## Stage 2: Write the prose

Invoke the `technical-writer` skill. Invoke it, do not merely imitate it: its
Pass 1 carries the outline approval gate, and reproducing the four pass names
from memory skips the gate every time.

Follow its four passes: structure, draft, refine, review. Do not restate its
style guide here.

**Pass 1 ends the turn.** Produce the title, the `##` and `###` headings with a
one-sentence description each, the approximate word count per section, and the
diagram or image planned for each section. Present that and stop. Writing body
prose in the same turn as the outline is the failure this gate exists to catch.

House rules for this blog, which override or extend that guide:

| Rule | Value |
|---|---|
| Spelling | British (`optimised`, `signalling`, `centre`) |
| Legacy bus terms | Manager and subordinate, not master and slave. Note on first use that older documents use the old terms and the signal names are unchanged |
| Acronyms | One post equals one chapter. Define once, on first use |
| Em dashes | Never, in posts or commit messages |
| Indentation | Spaces only |
| Status | `Status: draft` on creation. Never publish without being asked |
| Date | When moving draft to published, ask whether the date should change to today |

---

## Stage 3: Diagrams before images

Prefer a rendered diagram over a generated image whenever the content has
exact labels, counts, or signal names. Plugins render text perfectly; image
models do not.

| Content | Use | Fence |
|---|---|---|
| Timing, waveforms, handshakes | WaveDrom | ` ```wavedrom ` |
| State machines, flows, graphs | Graphviz | ` ```dot ` |
| Sequence and flowcharts | Mermaid | ` ```mermaid ` |
| Chord, scale, tab diagrams | Fretboard | ` ```fretboard ` |
| Dimensioned or mechanical drawings | Hand-authored SVG | see below |
| Mood, hero, concept illustration | Generated image | see Stage 4 |

Check WaveDrom wave strings are all the same length before building, since a
short string silently misaligns the diagram.

### Hand-authored SVG

`art` is the default for every image on this blog. The one exception is a
drawing whose whole purpose is exact numbers: a dimensioned elevation, a cut
list drawing, a scaled cross-section, a measured layout. No plugin fence covers
these, and `art/workflows/technical-diagrams.md` routes to image generation,
which inherits the exact-numbers problem the top of this stage warns about.

For those, author the SVG by hand in the lizard-spock palette, then render the
PNG pair so the house embed rules still apply:

```bash
rsvg-convert -w 1800 NN-name.svg -o NN-name-HQ.png
sips -Z 900 NN-name-HQ.png --out NN-name-900w.png
```

Palette to use in the SVG, taken from the aesthetic file so the drawings sit
with the generated images:

| Role | Value |
|---|---|
| Background | `#F5F2EC` |
| Lines | `#2D2D2D`, supporting detail `#4A4A4A` |
| Focal accent | `#7B35C2` |
| Action accent | `#E07820` |

Keep the SVG source in the image folder next to the PNGs so a dimension change
is an edit rather than a redraw. Anything not in the exact-numbers case goes
through `art`, and choosing SVG over `art` for a borderline image is a decision
to state to the user, not to make silently.

---

## Stage 4: Generate images

Authentication is a `GOOGLE_API_KEY` in `~/.claude/.env`, read automatically.
There is no browser login. Do not use `genimg-gemini-web` for this blog.

1. Read `~/.claude/skills/art/aesthetics/lizard-spock.md` and take its mandatory base prompt prefix verbatim.
2. Write one prompt file per image: composition, exact label list, accents, layout, and a critical constraints line.
3. State counts explicitly when the image contains repeated elements. "Exactly one arrow per row", "exactly four highlighted cells". Vague counts come back wrong.
4. **Prototype first, at 512px.** This is the gate. Render one image, or one
   representative image per visual family, at preview size and look at it:

```bash
cd ~/.claude/skills/art/tools
npx -y bun generate-image.ts \
  --prompt "$(cat base.md composition.md)" \
  --size 512px \
  --output /tmp/preview-NN-name.png
```

   Read the preview back and check it against the spec yourself first. Then
   **put it on the user's screen**:

```bash
open /tmp/preview-NN-name.png                  # single image, opens in Preview
open -a Safari /tmp/contact-sheet.html         # a set: name the browser
```

   `open` is the mechanism. Not a file path pasted into the reply for them to
   open themselves, not a description, not a question about an image only you
   have seen.

   For a set, build a contact sheet, one page with every prototype and its
   label, so the whole set is judged in one look. Two things about that page:

   - **Name the application.** Bare `open` on an `.html` file follows the user's
     default handler, which on this machine is vim. Always `open -a Safari`.
   - **Embed the images as base64 data URIs**, not `file://` paths, so nothing
     depends on the browser's local subresource rules.

   Then wait. Describing an image in prose and asking "is this right" is not
   showing it: the user cannot see your context, and a written description is
   exactly the thing the prototype exists to replace. A 2K render of a
   composition nobody has looked at is wasted work, and a set of ten wasted at
   once is ten times worse.

5. Generate at full size, once the prototype is approved:

```bash
cd ~/.claude/skills/art/tools
npx -y bun generate-image.ts \
  --prompt "$(cat base.md composition.md)" \
  --size 2K --aspect-ratio 16:9 --thinking high \
  --output "<repo>/content/images/<Cat>/<Article>/NN-name-HQ.png"
```

6. **Read every generated image back and check it against the spec before accepting it.** This step is not optional. Image models produce technically wrong diagrams that look plausible: contradictory arrow directions, wrong element counts, invented labels. The model's own self-report of its errors is unreliable, so verify by looking.
7. Regenerate failures with tighter constraints. If a second attempt fails, build it as a `dot` diagram instead.
8. Produce the display pair:

```bash
cd <repo>/content/images/<Cat>/<Article>
for f in *-HQ.png; do sips -Z 900 "$f" --out "${f%-HQ.png}-900w.png"; done
```

9. Embed as a linked pair so the full resolution opens on click:

```markdown
[![descriptive alt text]({attach}/images/<Cat>/<Article>/NN-name-900w.png)]({attach}/images/<Cat>/<Article>/NN-name-HQ.png)
```

Alt text describes the content for a reader who cannot see it. Never `![image]`.

---

## Stage 5: Verify the build

```bash
source ./venv/bin/activate
make html 2>&1 | grep -E "^Done:|CRITICAL"
```

Then count the visuals actually rendered, because a plugin that fails falls
through to a syntax-highlighted code block instead of erroring:

```bash
H=output/drafts/<slug>.html      # or output/<slug>.html once published
echo "png=$(grep -c '900w.png' $H) wavedrom=$(grep -c wavedrom_ $H) fsm=$(grep -c fsm_ $H)"
```

A zero where a diagram is expected means the plugin did not run. Check the
build log for a traceback.

Confirm internal `{filename}` links resolved to real pages, and that both the
900w and HQ files reached `output/`.

If plugin code changed, clear the caches first: remove the plugin SVG cache,
then `make clean`, then `make html`.

---

## Stage 6: Publish and deploy

1. Set `Status: published`, asking about the date first.
2. Rebuild and re-run the Stage 5 checks against the published path.
3. Stage only the post folder and its image folder. Never `git add -A`, since the working tree carries unrelated drafts.
4. Commit with no `Co-Authored-By` trailer and no em dashes.
5. Push `main`.
6. Deploy in the background and tell the user it takes about 12 minutes:

```bash
make github    # run_in_background: true
```

7. Confirm the result: exit code, the `gh-pages` ref change, and that the slug appears in `git ls-tree --name-only origin/gh-pages`.

---

## Post layout

Long posts with their own images use a folder:

```
content/posts/YYYY-MM-DD_Title/YYYY-MM-DD_Title.md
content/images/<Category>/<Article>/NN-name-{HQ,900w}.png
```

Short posts without images can be a flat `content/posts/YYYY-MM-DD_Title.md`.

Metadata template:

```markdown
Title: [sentence case, colon for a sub-label]
Date: YYYY-MM-DD
Category: Engineering | Home & Garden | Hardware & Homelab | Music | Photography | Programming | Unix & Tools | Outdoor
Tags: [Tag1, Tag2]
Slug: [kebab-case]
Author: morganp
Summary: [one sentence, what the reader gets]
Status: draft
```
